const fs=require('fs')
const path=require('path')
const {v4:uuid}=require('uuid')

const inputDir=path.join(__dirname,"inputs")
if(!fs.existsSync(inputDir)){
    fs.mkdirSync(inputDir,{recursive:true});
}
const generateInputFile=(input)=>{
    console.log(input);
    const unq_id=uuid();
    const input_filename=`${unq_id}.txt`;
    const input_filePath=path.join(inputDir,input_filename);
    fs.writeFileSync(input_filePath,input);
    console.log("input created")
    return input_filePath;
};

module.exports={
    generateInputFile
};