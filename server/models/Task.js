const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    title:{
    type:String,
    required:true
    },
    description:{
    type:String
    },
    completed:{
        type:Boolean,
        Default:false
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"receiver",
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    difficulty:{
        type:String,
        enum:["בינוני","קל","קשה"]
    },
    comment:{
        type:String
    }
    },{
    timestamps:true
    })
    module.exports = mongoose.model('Task', taskSchema)