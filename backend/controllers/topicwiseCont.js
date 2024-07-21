const Problem=require("../models/problem.js");

module.exports.topicwise=async (req,res)=>{
    console.log(" topic-wise req recieved");
    const {topic}=req.params;
    // console.log(topic);
    try {
        const regex = new RegExp(topic.split('').join('\\s*'), 'i');
        const problems = await Problem.find({ tags: regex });
        // console.log(problems);
        res.json(problems); // Send the problems as JSON to the frontend        
        
    } catch (error) {
        console.error('Error fetching problems by tags:', error);
        res.status(500).json({ error: 'An error occurred while fetching problems' });
  
    }
};