const dotenv=require("dotenv");
dotenv.config();
const jwt=require("jsonwebtoken");

const getUserid=(token)=>{
    return new Promise((resolve,reject)=>{
        console.log(token);
        jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
            if (err) {
                reject ({ 
                    status: false,
                    message:"Please login !" 
    
                });
            } else {
                console.log(data.id);
                resolve(data.id) ;            
            }
        });
    })
    

}
module.exports={
    getUserid
};