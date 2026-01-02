import 'dotenv/config';
import express from "express";
import cors from "cors";
import { geminiGenrateContent } from "./utils/gemini.js";
import mongoose from 'mongoose';
import chatRouter from './routes/chat.js';

const app = express()

app.use(cors())
app.use(express.json())


async function ConnectDB(){
    await mongoose.connect(process.env.MONGODB_URI)
}

app.post('/test', async (req,res)=>{ 
    try{
    const body = req.body;
    const prompt = body.prompt;
    const content = await geminiGenrateContent(prompt)
    console.log("content", content)
    res.send(content)
    }catch(err){
        console.log(err)
    }
})

app.use('/api/v1/chat',chatRouter)




 ConnectDB().then(()=>{
    console.log("Database Connected !")
    app.listen(3000, ()=>{console.log("listening at 3000")})
 }).catch("Database connection failed , Server Not Started")
