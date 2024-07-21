const dotenv= require("dotenv");
const User=require("../models/users.js");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const UserStats = require('../models/userStats');

dotenv.config();


module.exports.signup= async (req,res)=>{
    try{
        // get all data from req body
        const {name,email,password}=req.body;

        //check all data should exist
        if(!(name&&email&&password)){
            return res.status(400).send("Please enter all required data")
        }
        const userExists= await User.findOne({name});
        if(userExists){
            return res.status(200).json({
                message:"user already exists",
                success:false,

            });
        }
        //check if user already exists
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(200).json({
                message:"user already exists",
                success:false,

            });
        }

        // encrypt password
        const hashedPassword=await bcrypt.hash(password,10);

        // save the user to data base
        const user= await User.create({
            name,
            email,
            password:hashedPassword,
        });

        const user_stats=new UserStats({
            user_id:user._id,
            problems_id_solved: [],
            contest_participated:[],
            contest_stats:[],
        })
        await user_stats.save();
        
        // create a token
        const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{
            expiresIn:"1d",
        });
         
        //store cookies
        const options={
            expires: new Date(Date.now()+1*24*60*60*1000),
            httpOnly:true,
        }

        //send token
        res.status(200).cookie("token",token,options).json({
            message:"You have succesfully registered",
            success:true,
            token,
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }

}
