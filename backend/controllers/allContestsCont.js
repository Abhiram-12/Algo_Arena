const Contest=require("../models/contests");
const {getUserid}=require('../utils/getUserid.js');

module.exports.ContestList=async (req,res)=>{
    try {
        console.log("all contests req received")
        const contests = await Contest.find({});
        console.log(contests);
        res.json(contests);       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error in fetching Contests' });
    }
};

module.exports.userContestList=async (req,res)=>{
    try {
        const token=req.cookies.token;
        const user_id= await getUserid(token);
        const contests = await Contest.find({ participants: user_id });
        // console.log(contests);
        res.json(contests);       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error in fetching Contests' });
    }
};

module.exports.contestDetails=async (req,res)=>{
    try {
        console.log("contest details req recieved");
        const contest_id=req.params.contestId;
        console.log(contest_id);
        const contest = await Contest.findById(contest_id);

        const currentTime = new Date();
        const contestStartTime = new Date(contest.start_time); 

        if (currentTime >= contestStartTime) {
            console.log("Contest has started, sending questions");
            res.json(contest);
        } else {
            console.log("Contest has not started yet");
            const contestWithoutProblems = { ...contest.toObject(), problem_ids: [] };
            console.log(contestWithoutProblems);
            res.json(contestWithoutProblems);
        }     
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error in fetching Contests' });
    }
};
