const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    role:{
        type:String,
        required:true,
        enum:["manager","client"]
    },
    address: {
        type:String
    },
    phone: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required: true
    },
    imageUrl:{
        type:String
    }
}, {
    timestamps: true
})

userSchema.index({ userId: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema)