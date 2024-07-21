const Contest = require('../models/contests'); 
const {getUserid} = require('../utils/getUserid'); 
const Leaderboard=require('../models/leaderboard.js');
const User=require('../models/users.js');
const UserStats=require('../models/userStats.js');

module.exports.contestRegister = async (req, res) => {
  try {
    console.log('register req recieved');

    const token = req.cookies.token;
    const user_id = await getUserid(token);
    const user= await User.findById(user_id);

    if (!user) {
      return res.status(401).send("User not found!");
    }
    console.log(user);
    const { contest_id } = req.params; // Extract contest_id from the URL parameters
    
    // Find the contest by its ID
    const contest = await Contest.findById(contest_id);
    if (!contest) {
      return res.status(404).send("Contest not found!");
    }
    console.log(contest.participants);
    // Check if the user is already registered
    if (contest.participants.includes(user._id)) {
      return res.status(200).send("User already registered in the contest!");
    }
    
    // Add the user to the participants array
    contest.participants.push(user._id);
    const leaderboard = await Leaderboard.findOne({ contest_id });
    if (!leaderboard) {
      return res.status(404).send("Leaderboard not found for the contest!");
    }
    const user_contest_details = {
      user_id: user._id,
      username: user.name,
      solvedProblemsCount: 0,
      totalPoints: 0,
      lastSubmissionTime: null,
      solvedProblems: []
    };
    leaderboard.topPerformers.push(user_contest_details);

    await UserStats.findOneAndUpdate(
      { user_id: user_id },
      { $addToSet: { contest_participated: contest._id } }, 
      { upsert: true, new: true } 
    );
    console.log("User stats updated");
    //update participants in contest
    await contest.save();    
    await leaderboard.save();
    res.status(200).send("User registered in the contest successfully!");
    
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while registering the user in the contest.");
  }
};
