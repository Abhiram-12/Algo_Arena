const moment = require('moment');
const Submission = require('../models/submissions');
const Contest = require('../models/contests');
const User = require('../models/users');
const Leaderboard = require('../models/leaderboard');
const UserStats = require('../models/userStats');

const updateUserStats = async (submissions, contest_id) => {
  try {
    for (const submission of submissions) {
      const { user_id, solvedProblems, totalPoints } = submission;
      
      const userStats = await UserStats.findOne({ user_id }) || new UserStats({ user_id });

      // Update problems solved
      solvedProblems.forEach(problem => {
        if (!userStats.problems_id_solved.includes(problem)) {
            userStats.problems_id_solved.push(problem);
        }
    });

      // Update contest stats
      const contestStatIndex = userStats.contest_stats.findIndex(stat => stat.contest_id.equals(contest_id));
      if (contestStatIndex !== -1) {
        const existingProblems = userStats.contest_stats[contestStatIndex].problems_solved;
        const newProblems = [...new Set([...existingProblems, ...solvedProblems])];
        userStats.contest_stats[contestStatIndex].problems_solved = newProblems;
        userStats.contest_stats[contestStatIndex].points = totalPoints;
      } else {
        userStats.contest_stats.push({
          contest_id,
          problems_solved: solvedProblems,
          points: totalPoints,
        });
      }

      await userStats.save();
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

module.exports.getLeaderboard = async (req, res) => {
  console.log('Get leaderboard query received');
  const { contest_id } = req.params;

  try {
    const contest = await Contest.findById(contest_id);
    if (!contest) {
      console.log('Contest not found');
      return res.status(404).json({ error: 'Contest not found' });
    }

    const { start_time, end_time} = contest;
    const now = moment();

    if (now.isAfter(end_time)) {
      console.log('Contest has ended, returning existing leaderboard');
      const existingLeaderboard = await Leaderboard.findOne({ contest_id });
      console.log(existingLeaderboard);
      return res.json(existingLeaderboard);
    }

    if (now.isBefore(start_time)) {
      const existingLeaderboard = await Leaderboard.findOne({ contest_id });
      if (existingLeaderboard) {
        console.log('Leaderboard already exists for the contest, returning existing leaderboard');
        return res.json(existingLeaderboard);
      }
    }

    const updatedLeaderboard= await updateLeaderboard(contest_id,res);
    const currLeaderboard = await Leaderboard.findOne({ contest_id });
    //console.log(updatedLeaderboard);
    return res.json(currLeaderboard);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateLeaderboard = async (contest_id,res) => {
  console.log('Update leaderboard query received');
  try {
    const contest = await Contest.findById(contest_id);
    if (!contest) {
      console.log('Contest not found');
      return res.status(404).json({ error: 'Contest not found' });
    }

    const { start_time, end_time, problem_ids, participants } = contest;
    const now = moment();

    if (now.isAfter(start_time)&&now.isBefore(end_time)){
      const submissions = await Submission.aggregate([
        {
          $match: {
            sub_time: { $gte: start_time, $lte: end_time },
            prob_id: { $in: problem_ids },
            user_id: { $in: participants }
          }
        },
        {
          $sort: { user_id: 1, prob_id: 1, sub_time: 1 },
        },
        {
          $group: {
            _id: { user_id: '$user_id', prob_id: '$prob_id' },
            latestAcceptedSubmission: {
              $first: {
                $cond: [{ $eq: ['$status', 'accepted'] }, '$$ROOT', null]
              }
            }
          }
        },
        {
          $replaceRoot: { newRoot: '$latestAcceptedSubmission' }
        },
        {
          $group: {
            _id: '$user_id',
            solvedProblemsCount: { $sum: { $cond: ['$prob_id', 1, 0] } },
            totalPoints: { $sum: '$points' },
            lastSubmissionTime: { $max: '$sub_time' },
            solvedProblems: { $push: '$prob_id' }
          }
        }, 
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            user_id: '$_id',
            username: '$user.name',
            solvedProblemsCount: 1,
            totalPoints: 1,
            lastSubmissionTime: 1,
            solvedProblems: 1
          }
        },       
        {
          $sort: { totalPoints: -1, lastSubmissionTime: 1 }
        }
      ]);
  
      for (const user_id of participants) {
        if (!submissions.some(submission => submission.user_id.equals(user_id))) {
          const user = await User.findById(user_id);
          const username = user ? user.name : 'Unknown';
          submissions.push({
            user_id,
            username,
            solvedProblemsCount: 0,
            totalPoints: 0,
            lastSubmissionTime: now,
            solvedProblems: []
          });
        }
      }
  
      await updateUserStats(submissions, contest_id);
  
      const updatedLeaderboard = await Leaderboard.findOneAndUpdate(
        { contest_id },
        {
          contest_id,
          topPerformers: submissions
        },
        { upsert: true, new: true }
      );
      // console.log(updatedLeaderboard);
      return updatedLeaderboard;
    }
    else {
      const existingLeaderboard = await Leaderboard.findOne({ contest_id });
      return existingLeaderboard;
    }

  } catch (error) {
    console.error('Error updating leaderboard:', error);
    if (res) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      throw new Error('Internal server error');
    }
  }
};

