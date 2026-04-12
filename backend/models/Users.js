import mongoose from "mongoose";
import { threadSchema } from "./Threads.js";

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    isPro:{
        type: Boolean,
        default: false 
    },
    password:{
        type: String,
        required: true
    },
    threads : [threadSchema]

}, 
{timestamps:true});

export const Users = mongoose.model("Users", userSchema)