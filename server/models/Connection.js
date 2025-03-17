const mongoose = require("mongoose")
const connectionSchema = new mongoose.Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Project"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Connection', connectionSchema)