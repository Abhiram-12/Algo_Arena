const {addAdmin,removeAdmin}=require("../controllers/addAdminCont");
const router=require("express").Router();
const {adminVerification}=require('../middlewares/auth')

router.post('/addAdmin',adminVerification,addAdmin);
router.post('/removeadmin',adminVerification,removeAdmin);
module.exports=router;