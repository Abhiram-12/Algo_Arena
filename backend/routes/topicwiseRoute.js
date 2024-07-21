const {topicwise}=require("../controllers/topicwiseCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.get('/:topic',topicwise);
module.exports=router;