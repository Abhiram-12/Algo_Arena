const {signup}=require("../controllers/SignupCont");
const router=require("express").Router();


router.post('/',signup);
module.exports=router;