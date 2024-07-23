const Contest=require("../models/contests.js");
const {getUserid}=require('../utils/getUserid.js');
const Leaderboard=require('../models/leaderboard.js');

module.exports.addContest= async (req,res)=>{
    try{
        // get all data from req body
        console.log("add contest req received");
        const {title,date,start_time,end_time,problem_ids}=req.body;
        console.log(req.body); //debugging line
        const token=req.cookies.token;

        // check all data should exist
        if(!(title&&date&&start_time&&end_time&&problem_ids)){
            return res.status(400).send("Please enter all required data")
        }

        if(problem_ids.length===0){
            return res.status(400).send("Please select problems");
        }

        const author= await getUserid(token);
        
        const contests = await Contest.find();
        const count=contests.length+1;
        const contest = await Contest.create({
            title,
            date,
            start_time,
            end_time,
            participants:[],
            problem_ids,
            author,
            contest_count:count,
        });

        const newLeaderboard = new Leaderboard({
            contest_id:contest._id,
            topPerformers: []
          });
        await newLeaderboard.save();

        console.log('contest created ')
        // Respond with success message
        res.status(200).json({
            message: 'Contest successfully added',
            success: true,
        });
    }
    catch(error){
        console.error('Error adding Contest:',error);
        res.status(500).json({ 
            error: error,
            message: 'Contest successfully added',
        });
    }

}
