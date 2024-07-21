const Contest = require("../models/contests");

module.exports.ContestInfo = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    console.log(req.params.id);

    const isStarted = contest.start_time <= new Date();

    if (!isStarted) {
      let woProblems = { ...contest.toObject(), problem_ids: [] };
      return res.json(woProblems);
    }

    res.json(contest);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error in fetching contest details' });
  }
};
