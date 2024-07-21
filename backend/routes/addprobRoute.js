const {addProblem}=require("../controllers/addprobCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.post('/',userverification,addProblem);
module.exports=router;