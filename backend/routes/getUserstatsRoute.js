const {userStatsInfo}=require("../controllers/getUserstatsCont.js");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.get('/',userverification,userStatsInfo);
module.exports=router;