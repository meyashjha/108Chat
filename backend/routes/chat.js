
import express from 'express';
import { Threads } from '../models/Threads.js';
import { geminiGenerateContent } from '../utils/gemini.js';
import { parallelSearch, parallelChat } from '../utils/parallel.js';
import { Users } from '../models/Users.js';
import { authenticateToken } from '../utils/auth.js';

const chatRouter = express.Router();

// Protect all chat routes
chatRouter.use(authenticateToken);


// Create a new thread and connect to user
chatRouter.post("/test", async(req,res)=>{
    try{
        const body = req.body;
        const userId = req.user.id;
        const thread = new Threads({
            threadId: body.id,
            title: body.title
        });
        const response = await thread.save();
        // Add thread to user's threads array
        await Users.findByIdAndUpdate(userId, { $push: { threads: thread } });
        res.send(response);
    }catch(err){
        res.status(500).json({error:err})
    }
});



// Get all threads for the logged-in user
chatRouter.get('/thread', async(req,res)=>{
    try{
        const userId = req.user.id;
        const user = await Users.findById(userId).select('threads');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.threads || []);
    }catch(err){
        console.log(err)
        res.status(500).json({Error: err})
    }
});


// Get a specific thread for the logged-in user
chatRouter.get('/thread/:id', async(req,res)=>{
    try{
        const userId = req.user.id;
        const id = req.params.id;
        const user = await Users.findById(userId).select('threads');
        const thread = user.threads.find(t => t.threadId === id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });
        res.json(thread);
    }catch(err){
        console.log(err)
        res.status(500).json({Error: err})
    }
});


// Delete a thread for the logged-in user
chatRouter.delete('/thread/:id', async(req,res)=>{
    try{
        const userId = req.user.id;
        const { id } = req.params;
        // Remove from Threads collection
        const deletedThread = await Threads.findOneAndDelete({ threadId: id });
        if (!deletedThread) {
            return res.status(404).json({ message: "Thread Not Found" });
        }
        // Remove from user's threads array
        await Users.findByIdAndUpdate(userId, { $pull: { threads: { threadId: id } } });
        res.status(200).json({ message: "Thread deleted Successfully" });
    }catch(err){
        console.log(err)
        res.status(500).json({Error: err})
    }
});


chatRouter.post('/talk', async(req,res)=>{
    try{
        const {threadId, prompt, model} = req.body;
        const userId = req.user.id;
        if(!threadId || !prompt){
            throw new Error("Invalid request parameters");
        }

        let thread = await Threads.findOne({threadId});
        let isNewThread = false;

        if(!thread){
            thread = new Threads({threadId, title: prompt, messages: [{
                role: "user", 
                content: prompt
            }]});
            isNewThread = true;
        }
        else{
            thread.messages.push({
            role: "user",
            content: prompt
        });
        }

        // Route to the correct AI provider based on model selection
        let assistantReply;
        const selectedModel = model || "gemini";

        switch (selectedModel) {
            case "web_search":
                assistantReply = await parallelSearch(prompt);
                break;
            case "gpt4":
                assistantReply = await parallelChat(prompt);
                break;
            case "gemini":
            default:
                assistantReply = await geminiGenerateContent(prompt);
                break;
        }

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });
                                     
        await thread.save();

        // Link new threads to the user
        if (isNewThread) {
            await Users.findByIdAndUpdate(userId, { $push: { threads: thread } });
        } else {
            // Sync only the messages array to avoid timestamp conflicts
            await Users.updateOne(
                { _id: userId, "threads.threadId": threadId },
                { $set: { "threads.$.messages": thread.messages, "threads.$.title": thread.title } }
            );
        }

        res.json({reply : assistantReply, thread});
    }catch(err){
        console.log(err)
        res.status(500).json({Error: err.message || err})
    }
})


export default chatRouter;