const Admin=require("../models/admin.js");
const User=require("../models/users.js");
const {getUserid}=require('../utils/getUserid.js');


module.exports.addAdmin= async (req,res)=>{
    try{
        
        console.log("add admin req received");
        const {user_ids}=req.body;
        console.log(req.body); //debugging line
        const token=req.cookies.token;

        if(!user_ids||user_ids.length<=0){
            return res.status(400).send("No one selected.")
        }

        const author= await getUserid(token);

        for (const user_id of user_ids) {
            const existingAdmin = await Admin.findOne({ user_id: user_id });

            if (existingAdmin) {
                console.log(`User ID: ${user_id} is already an admin.`);
            } else {
                const admin = new Admin({
                    user_id: user_id,
                    access_to: 'all'
                });

                await admin.save();
                console.log(`Admin added for user ID: ${user_id}`);
            }
        }

        console.log('Admin added ')
        // Respond with success message
        res.status(200).json({
            message: 'Admin successfully added',
            success: true,
        });
    }
    catch(error){
        console.error('Error adding Admin:',error);
        res.status(500).json({ error: error});
    }

}


module.exports.removeAdmin= async (req,res)=>{
    try {
        console.log("delete admin req received");
        const { user_ids } = req.body;
        // console.log(req.body); // debugging line
        const token = req.cookies.token;

        if (!user_ids) {
            return res.status(400).send("No one selected.");
        }

        const author = await getUserid(token);
        for (const user_id of user_ids) {
            const admin = await Admin.findOneAndDelete({ user_id: user_id });
            if (admin) {
                console.log(`Admin removed for user ID: ${user_id}`);
            } else {
                console.log(`Admin not found for user ID: ${user_id}`);
            }
        }

        console.log('All specified admins removed');
        res.status(200).json({
            message: 'Admins successfully removed',
            success: true,
        });
    } catch (error) {
        console.error('Error removing Admin:', error);
        res.status(500).json({ error: error });
    }

}
