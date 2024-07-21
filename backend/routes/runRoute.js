const {run}=require("../controllers/runCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.post('/',userverification,run);
module.exports=router;