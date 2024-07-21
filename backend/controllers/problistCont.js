const Problem=require("../models/problem.js");

module.exports.probList=async (req,res)=>{
    try {
        const problems = await Problem.find({});
        res.json(problems); // Send the problems as JSON to the frontend        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'error in fetching problems' });
    }
};