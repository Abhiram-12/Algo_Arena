const {checkAuth}=require("../controllers/check-authCont");
const router=require("express").Router();

router.get('/',checkAuth);
module.exports=router;