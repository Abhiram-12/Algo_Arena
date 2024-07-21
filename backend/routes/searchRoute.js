const {SearchProblem,SearchUser}=require("../controllers/searchCont");
const router=require("express").Router();
const {userverification}=require('../middlewares/auth')

router.get('/prob',SearchProblem);
router.get('/user',SearchUser);
module.exports=router;