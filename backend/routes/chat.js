import express from 'express'
import { Threads } from '../models/threads.js';

const chatRouter = express.Router();

chatRouter.post("/test", async(req,res)=>{
    try{
        const body = req.body;

        const thread = new Threads({
            threadId:body.id,
            title:body.title
        });
        const response =await thread.save();
        res.send(response);
    }catch(err){
        res.status(500).json({error:err})
    }
})


chatRouter.get('/thread', async(req,res)=>{
    try{
        const threads = await Threads.find({}).sort({updatedAt:-1})
        res.json(threads);

    }catch(err){
        console.log(err)
        res.status(500),json({Error: err})
    }
})

chatRouter.get('/thread/:id', async(req,res)=>{
    try{
        const id= req.params.id;
        const threads = await Threads.findOne({threadId:id})
        res.json(threads)
    }catch(err){
        console.log(err)
        res.status(500),json({Error: err})
    }
})

chatRouter.delete('/thread/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedThreads = await Threads.findOneAndDelete({threadId:id})
        if(!deletedThreads){
            res.status(404).json({message: "Thread Not Found"})
        }
        res.status(200).json({message: "Thread deleted Successfully"})

    }catch(err){
        console.log(err)
        res.status(500),json({Error: err})
    }
})




export default chatRouter;