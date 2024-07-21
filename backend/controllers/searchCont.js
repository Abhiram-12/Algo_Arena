const Problem = require("../models/problem.js");
const User = require("../models/users.js");

module.exports.SearchProblem = async (req, res) => {
    console.log(" search req recieved");
    const { query } = req.query;
    const problems = await Problem.find({ title: new RegExp(query, 'i') });
    res.json(problems);

};


module.exports.SearchUser = async (req, res) => {
    console.log(" search user req recieved");
    const { query } = req.query;
    const users = await User.find({ name: new RegExp(query, 'i') });
    res.json(users);

};