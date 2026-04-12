
import express from "express"
import { Users } from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";


// Signup Route
userRouter.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 11);
        const newUser = new Users({ name, email, password: hashedPassword });
        await newUser.save();
        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, email: newUser.email, isPro: newUser.isPro },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(201).json({
            message: "User created successfully",
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, isPro: newUser.isPro }
        });
    } catch (err) {
        console.error("Error in signup:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Login Route
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, isPro: user.isPro },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, isPro: user.isPro }
        });
    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default userRouter;

