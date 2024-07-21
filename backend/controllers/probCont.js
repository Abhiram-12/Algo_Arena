const Problem=require("../models/problem.js");


module.exports.prob=async (req,res)=>{
    try {
        const problem = await Problem.findById(req.params.id);
        console.log(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        res.json(problem);       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'error in fetching problem' });
    }
};