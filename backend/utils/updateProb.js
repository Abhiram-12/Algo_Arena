const dotenv=require("dotenv");
dotenv.config();
const {DBconnection}= require("../database/db.js");
const Problem = require('../models/problem');


DBconnection();

const updateProblemCounts = async () => {
  try {
    // Fetch all problems
    const problems = await Problem.find();

    // Update each problem with the new problemCount
    for (let i = 0; i < problems.length; i++) {
      problems[i].prob_count = i + 1;
      await problems[i].save();
    }

    console.log('All problem documents updated successfully');
  } catch (error) {
    console.error('Error updating problem documents:', error);
  } 
};

// Run the update script
updateProblemCounts();
