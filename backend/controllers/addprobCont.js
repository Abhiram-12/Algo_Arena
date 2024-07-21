const Problem=require("../models/problem.js");

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

module.exports.addProblem= async (req,res)=>{
    try{
        // get all data from req body
        const {title,description,inputFormat,outputFormat,sampleTestcases,testcases,tags,difficulty,prob_count}=req.body;

        //check all data should exist
        if(!(title&&description&&inputFormat&&outputFormat&&sampleTestcases&&testcases&&tags&&difficulty&&prob_count)){
            return res.status(400).send("Please enter all required data")
        }

        // Capitalize the first letter of each tag
        const capitalizedTags = tags.map(tag => capitalizeFirstLetter(tag));

        // Capitalize the first letter of the difficulty
        const capitalizedDifficulty = capitalizeFirstLetter(difficulty);

        // Save the problem to the database
        const problem = await Problem.create({
            title,
            description,
            inputFormat,
            outputFormat,
            sampleTestcases,
            testcases,
            tags:capitalizedTags,
            difficulty:capitalizedDifficulty,
            prob_count
        });

        // Respond with success message
        res.status(200).json({
            message: 'Problem successfully added',
            success: true,
            data: problem  // Optionally, you can send back the created problem object
        });
    }
    catch(error){
        console.error('Error adding problem:',error);
        res.status(500).json({ error: error});
    }

}
