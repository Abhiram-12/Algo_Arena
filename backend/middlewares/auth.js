const User=require("../models/users");
const Admin=require("../models/admin");
const dotenv=require('dotenv');
dotenv.config();
const jwt=require("jsonwebtoken");

const userverification=async (req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(404).json({
            message:"please login or signup",
            success:false,
        })
    }
    jwt.verify(token,process.env.SECRET_KEY,async (err,data)=>{
        if(err){
            return res.status(404).json({
                message:"not a verified user",
                success:false
            });
        }
        else{
            const user= await User.findById(data.id)
            if(!user){ 
                return res.json({
                    status:false
                })
            }
            next();
        }
    })
}


const adminVerification=async (req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(404).json({
            message:"please login or signup",
            success:false,
        })
    }
    jwt.verify(token,process.env.SECRET_KEY,async (err,data)=>{
        if(err){
            return res.status(404).json({
                message:"not a verified user",
                success:false
            });
        }
        else{
            const admin= await Admin.findOne({user_id:data.id});
            if(!admin){ 
                return res.json({
                    status:false,
                    message:"Not an admin"
                })
            }
            
            next();
        }
    })
}
module.exports={
    userverification,
    adminVerification
}