const mongoose = require("mongoose")
const organizerSchema = new mongoose.Schema({
    address: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim:true,
        lowercase:true
    },
    phone: {
        type:String
    },
    userIdRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    profession:{
        type: String
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Organizer', organizerSchema)