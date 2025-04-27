const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connection",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    difficulty: {
        type: String
    },
    comment: {
        type: String
    },
    file:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"File"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Task', taskSchema)