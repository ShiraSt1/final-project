const mongoose = require("mongoose")
const projectToManagerSchema = new mongoose.Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Project"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('ProjectToManager', projectToManagerSchema)