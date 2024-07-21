const {logout}=require("../controllers/loginCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.get('/',userverification,logout);
module.exports=router;