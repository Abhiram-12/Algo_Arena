const fs=require('fs')
const path=require('path')
const {v4:uuid}=require('uuid')

const codeDir=path.join(__dirname,"codes")
if(!fs.existsSync(codeDir)){
    fs.mkdirSync(codeDir,{recursive:true});
}
const generateFile=(lang,code)=>{
    // if(lang=="java"){
            
    //     // Extract the class name using a regular expression
    //     const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    //     if (!classNameMatch) {
    //         const unq_id = uuid();
    //         const filePath = path.join(codeDir, `${unq_id}.java`);
    //         fs.writeFileSync(filePath, code, 'utf8');
    //         return filePath;
    //         // return (new Error('Class name not found in the Java code.'));
    //     }

    //     const className = classNameMatch[1];
    //     const filePath = path.join(codeDir, `${className}.java`);

    //     // Writing the Java code to a file named after the class name
    //     fs.writeFileSync(filePath, code, 'utf8');
    //     console.log("code file created")
    //     return filePath;
    // }

    const unq_id=uuid();
    const filename=`${unq_id}.${lang}`;
    const filePath=path.join(codeDir,filename);
    fs.writeFileSync(filePath,code);
    console.log("code file created");
    return filePath;
};

module.exports={
    generateFile
};