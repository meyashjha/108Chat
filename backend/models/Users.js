import mongoose from "mongoose";
import {threadSchema} from "./Thread"

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

    threads : [threadSchema]

}, 
{timestamps:true});

export const Users = mongoose.model("Users", userSchema)