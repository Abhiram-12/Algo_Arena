const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    access_to: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Admin", adminSchema);