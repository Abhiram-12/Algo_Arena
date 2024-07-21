const Submission = require("../models/submissions");
const {getUserid} = require("../utils/getUserid");

module.exports.SubmissionsList = async (req, res) => {
    try {
        const { prob_id } = req.params;
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user_id =await getUserid(token);

        // Check if user_id is valid
        if (!user_id) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log(user_id);
        console.log(prob_id);
        // Find submissions by user_id and prob_id
        const submissions = await Submission.find({prob_id:prob_id,user_id:user_id });

        // Send the response with the found submissions
        res.json(submissions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error in fetching Submissions' });
    }
};
