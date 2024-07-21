const UserStats = require("../models/userStats");
const {getUserid} = require("../utils/getUserid");

module.exports.userStatsInfo = async (req, res) => {
    try {
        const token = req.cookies.token;
        console.log("user stats req rec")
        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const user_id = await getUserid(token);

        // Check if user_id is valid
        if (!user_id) {
            console.log("invalid token")
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Find submissions by user_id and prob_id
        const userStat = await UserStats.find({user_id:user_id });

        // Send the response with the found submissions
        res.json(userStat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error in fetching user stats' });
    }
};
