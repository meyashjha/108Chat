import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role :{
        type: String,
        enum : ["user", " assistant"],
        require : true
    },
    content : {
        type : String,
        required : true
    },
    timestamp: { type: Date, default: Date.now }
})

const threadSchema = new mongoose.Schema({
    threadId:{
        type : String,
        required: true,
        unique : true 
    },
    title:{
        type : String,
        default : "New Chat"
    },
    messages : [messageSchema],
},{ timestamps: true });

export const Threads = mongoose.model("Threads", threadSchema);