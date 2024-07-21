const {submit}=require("../controllers/submitCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.post('/',userverification,submit);
module.exports=router;