const {probList}=require("../controllers/problistCont");
const {prob}=require("../controllers/probCont");
const {submit}=require("../controllers/submitCont");
const {userverification}=require('../middlewares/auth')
const router=require("express").Router();



router.get('/',probList);
router.get('/:id',prob);
router.post('/:id/submit',userverification,submit)
module.exports=router;