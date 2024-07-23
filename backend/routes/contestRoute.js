const router=require("express").Router();
const {addContest}=require("../controllers/addcontestCont");
const {ContestList,userContestList,contestDetails,userContestdetails}=require("../controllers/allContestsCont");
const {contestRegister}=require("../controllers/contestRegisterCont");
const {getLeaderboard}  = require("../controllers/leaderboardCont");
const { userverification, adminVerification } = require('../middlewares/auth');

router.get('/',ContestList);
router.get('/mycontests',userverification,userContestList);
router.get('/mycontests/:contest_id',userverification,userContestdetails);
router.post('/addcontest',adminVerification,addContest);
router.get("/register/:contest_id",userverification,contestRegister);
router.get("/getleaderboard/:contest_id",userverification,getLeaderboard);
// router.get("/updateleaderboard/:contest_id",updateLeaderboard);
router.get('/:contestId',userverification,contestDetails);
module.exports=router;