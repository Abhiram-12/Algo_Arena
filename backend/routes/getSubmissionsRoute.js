const {SubmissionsList}=require("../controllers/getSubmissionsCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.get('/:prob_id',userverification,SubmissionsList);
module.exports=router;