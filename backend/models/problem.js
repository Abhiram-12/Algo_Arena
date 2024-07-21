const mongoose=require("mongoose");

const problemSchema= new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        required: true
    },
    outputFormat: {
        type: String,
        required: true
    },
    sampleTestcases: {
        type: [{
          input: String,
          output: String
        }],
        required: true
    },
    testcases: {
        type: [{
            input: String,
            output: String
        }],
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    difficulty:{
        type:String,
        required:true
    },
    prob_count:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model("Problem",problemSchema);