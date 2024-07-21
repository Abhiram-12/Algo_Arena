const express= require('express');
const app= express();
const dotenv=require("dotenv");
dotenv.config();
const {DBconnection}= require("./database/db.js");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const loginRoute=require("./routes/loginRoute.js");
const logoutRoute=require("./routes/logoutRoute.js");
const signupRoute=require("./routes/signupRoute.js");
const runRoute=require("./routes/runRoute.js");
const addprobRoute=require("./routes/addprobRoute.js");
const probsRoute=require('./routes/probListRoute.js');
const topicwiseRoute=require('./routes/topicwiseRoute.js');
const contestRoute=require('./routes/contestRoute.js');
const checkAuth=require('./routes/checkAuthRoute.js');
const handleSearch=require('./routes/searchRoute.js');
const getSubmissionsRoute=require('./routes/getSubmissionsRoute.js')
const addAdminRoute=require('./routes/addAdminRoute.js')
const getUserStats=require('./routes/getUserstatsRoute.js')

const corsOptions = {
    origin: 'http://localhost:5173' , 
    credentials: true, // Allow credentials (cookies, etc.)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

DBconnection();

app.use('/login',loginRoute);
app.use('/logout',logoutRoute);
app.use('/signup',signupRoute);
app.use('/run',runRoute);
app.use('/addprob',addprobRoute);
app.use('/problems',probsRoute);
app.use('/contests',contestRoute);
app.use('/check-auth',checkAuth);
app.use('/search',handleSearch);
app.use('/submissions',getSubmissionsRoute);
app.use('/topics',topicwiseRoute);
app.use('/admin',addAdminRoute);
app.use('/getUserstats',getUserStats);



app.listen(8080,()=>{
    console.log("server running on 8080")
});