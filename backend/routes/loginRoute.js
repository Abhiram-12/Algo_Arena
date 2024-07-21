const {login,logout}=require("../controllers/loginCont");
const router=require("express").Router();

router.post('/',login);
module.exports=router;