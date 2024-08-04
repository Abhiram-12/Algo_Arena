const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const deleteFiles = (files) => {
    files.forEach(file => {
        fs.unlink(file, (err) => {
            if (err) console.error(`Error deleting file ${file}: ${err}`);
        });
    });
};


const executeCpp = (filepath, inputPath) => {
    const uniq_id = path.basename(filepath).split(".")[0];
    const filename = `${uniq_id}.exe`;
    const outPath = path.join(outputPath, filename);

    return new Promise((resolve, reject) => {
        exec(`g++ ${filepath} -o ${outPath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                deleteFiles([outPath]);
                return reject({ message: error.message, code: 500 });
            }
            if (stderr) {
                console.log(stderr);
                deleteFiles([outPath]);
                return reject({ message: stderr, code: 401 });
            }

            exec(`cd ${outputPath} && .\\${filename} < ${inputPath}`, (error, stdout, stderr) => {
                if (error) {
                    deleteFiles([outPath]);
                    return reject({ message: error.message, code: 500 });
                }
                if (stderr) {
                    deleteFiles([outPath]);
                    return reject({ message: stderr, code: 401 });
                }

                deleteFiles([outPath]);
                resolve(stdout.trim());
            });
        });
    });
};

const executeJava = (filepath, inputPath) => {
    console.log(filepath);
    console.log(`Compiling Java file: ${filepath}`); // Debugging line

    return new Promise((resolve, reject) => {
        const runCommand = `java ${filepath} < ${inputPath}`;

        exec(runCommand, (runError, runStdout, runStderr) => {
            if (runError) {
                deleteFiles([filepath]);
                console.error(`Execution error: ${runStderr}`);
                return reject(new Error(`Execution error: ${runStderr}`));
            }

            if (runStderr) {
                console.warn(`Runtime warnings: ${runStderr}`);
            }
            
            
            console.log(`Execution output: ${runStdout.trim()}`);
            resolve(runStdout.trim());
        });
    });
};



const executePython = (filepath, inputPath) => {
    return new Promise((resolve, reject) => {
        exec(`python ${filepath} < ${inputPath}`, (error, stdout, stderr) => {
            if (error) {
                deleteFiles([filepath, inputPath]);
                return reject(new Error(`Execution error: ${stderr}`));
            }
            if (stderr) {
                console.warn(`Runtime warnings: ${stderr}`);
            }

            // deleteFiles([filepath, inputPath]);
            resolve(stdout.trim());
        });
    });
};



module.exports = {
    executeCpp,
    executeJava,
    executePython
};
