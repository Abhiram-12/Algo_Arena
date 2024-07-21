const Problem = require('../models/problem');
const UserStats = require('../models/userStats.js');
const Submission = require('../models/submissions.js');
const fs = require('fs');
const { generateFile } = require('../utils/generateFile');
const { getUserid } = require('../utils/getUserid.js')
const { executeCpp, executeJava, executePython } = require('../utils/executeCode.js');
const { generateInputFile } = require('../utils/generateInputFile.js');

const deleteFiles = (files) => {
    files.forEach(file => {
        fs.unlink(file, (err) => {
            if (err) console.error(`Error deleting file ${file}: ${err}`);
        });
    });
};

module.exports.submit = async (req, res) => {
    const token = req.cookies.token;
    const { lang = 'cpp', code } = req.body;
    const { id } = req.params;
    const user_id = await getUserid(token);

    console.log('Received ID:', id); // Debugging line

    if (!code) {
        return res.status(400).json({ success: false, message: "Empty code!" });
    }

    try {
        const problem = await Problem.findById(id);

        if (!problem) {
            console.log('Problem not found with ID:', id); // Debugging line
            return res.status(404).json({ success: false, message: "Problem not found!" });
        }

        // Calculate points based on problem difficulty
        const difficultyPoints = {
            easy: 2,
            medium: 4,
            hard: 8,
        };

        // Convert the difficulty level to lowercase before lookup
        const points = difficultyPoints[problem.difficulty.toLowerCase()] || 0;


        const testCases = problem.testcases;
        const results = [];
        let passedAllTests = true;
        const filepath = generateFile(lang, code);
        const filesToDelete = [filepath];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const inputPath = generateInputFile(testCase.input);
            const expectedOutput = testCase.output.trim();

            filesToDelete.push(inputPath);

            try {
                let actualOutput;
                console.log(lang);
                if (lang == "java") {
                    actualOutput = await executeJava(filepath, inputPath);
                }
                if (lang == "cpp") {
                    actualOutput = await executeCpp(filepath, inputPath);
                }
                else {
                    actualOutput = await executePython(filepath, inputPath);
                }
                const passed = actualOutput === expectedOutput;
                // deleteFiles([inputPath]);
                results.push({
                    input: testCase.input,
                    expectedOutput,
                    actualOutput,
                    passed
                });

                if (!passed) {
                    passedAllTests = false;
                }
            } catch (execError) {
                console.log("hello thats me",execError);
                // deleteFiles([inputPath]);
                results.push({
                    input: testCase.input,
                    expectedOutput,
                    actualOutput: null,
                    passed: false,
                    error: execError.message
                });
                passedAllTests = false;
            }
        }

        // deleteFiles(filesToDelete);
        // Create a new submission
        const submission = new Submission({
            user_id: user_id,
            prob_id: problem._id,
            code: code,
            status: passedAllTests ? 'accepted' : 'rejected',
            points: passedAllTests ? points : 0,
            sub_time: new Date()
        });

        // Save the submission to the database
        await submission.save();
        console.log("submission saved")
        if (passedAllTests) {
            await UserStats.findOneAndUpdate(
                { user_id: user_id },
                { $addToSet: { problems_id_solved: problem._id } }, 
                { upsert: true, new: true } 
            );
            console.log("User stats updated");
        }


        res.send({
            message: `Data submitted for ID: ${id}`,
            results: results,
            submission: submission
        });

    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error " + error.message });
    }
}