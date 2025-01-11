const mongoose = require("mongoose")
const receiverSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Orgenizer"
    },
    userIdRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    address: {
        type:String
    },
    phone: {
        type:String
    },
    email: {
        type:String,
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Receiver', receiverSchema)