import 'dotenv/config';
import express from "express";
import cors from "cors";
import { geminiGenerateContent } from "./utils/gemini.js";
import mongoose from 'mongoose';
import chatRouter from './routes/chat.js';
import userRouter from './routes/user.js';

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())


async function ConnectDB(){
    await mongoose.connect(process.env.MONGODB_URI)
}

app.post('/test', async (req,res)=>{ 
    try{
    const body = req.body;
    const prompt = body.prompt;
    const content = await geminiGenerateContent(prompt)
    console.log("content", content)
    res.send(content)
    }catch(err){
        console.log(err)
    }
})

app.use('/api/v1/chat',chatRouter);
app.use('/api/v1/user', userRouter);




 ConnectDB().then(()=>{
    console.log("Database Connected !")
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=>{console.log(`listening at ${PORT}`)})
 }).catch("Database connection failed , Server Not Started")
