const {generateFile}=require('../utils/generateFile');
const {executeCpp,executeJava,executePython}=require('../utils/executeCode.js');
const {generateInputFile}=require('../utils/generateInputFile');
const fs = require('fs');


const deleteFiles = (files) => {
    files.forEach(file => {
        fs.unlink(file, (err) => {
            if (err) console.error(`Error deleting file ${file}: ${err}`);
        });
    });
};

module.exports.run= async (req,res)=>{

    const {lang='cpp',code,input}=req.body;
    if(code===undefined){
        return res.status(400).json({success:false,message:"Empty code!"})
    }
    const filepath= generateFile(lang, code);
    const inputpath= generateInputFile(input);
    try {
        let output;
        if(lang==="cpp"){
            output=await executeCpp(filepath,inputpath);
            console.log(output);
        }
        else if(lang==="py"){
            output =await executePython(filepath,inputpath);
        }
        else{
            output=await executeJava(filepath,inputpath);
        }

        deleteFiles([filepath,inputpath]);

        res.send({output});
    } catch (error) {

        deleteFiles([filepath,inputpath]);
        res.status(500).json({success:false,message:"Error"+error.message});
    }

    
}