import express from "express";
import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET_KEY;
const options = {
    expiresIn: "1d"
};

router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        user._id = uuidv4();
        user.createdDate = new Date();
        user.isAdmin = false;

        const checkUserEmail = await User.findOne({ email: user.email });

        if (checkUserEmail != null) {
            res.status(403).json({ message: "This email address is already in use!" });
        } else {
            await user.save();
            const token = jwt.sign({}, secretKey, options);
            const model = { token: token, user: user };
            res.json(model);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (user == null) {
            res.status(403).json({ message: "User not found!" });
        } else {
            if (user.password !== password) {
                res.status(403).json({ message: "Incorrect password!" });
            } else {
                const token = jwt.sign({}, secretKey, options);
                const model = { token: token, user: user };
                res.json(model);
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;