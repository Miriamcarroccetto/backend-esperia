import authMiddleware from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";
import express from "express";
import 'dotenv/config';
import User from "../models/userSchema.js";
import requireAdmin from '../middlewares/requireAdmin.js';

const saltRounds = parseInt(process.env.SALT_ROUNDS)

const router = express.Router()


router.post('/register', [authMiddleware, requireAdmin] ,async (req, res, next) => {
    const { name, lastname, email, birthday, password } = req.body


    try {

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email già registrata" })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = new User({
            name,
            lastname,
            email,
            birthday,
            password: hashedPassword,
            isAdmin: true
        })

        await newAdmin.save()

        const token = generateToken({ id: newAdmin._id, email: newAdmin.email, isAdmin: true })

        res.status(201).json({ token })
    } catch (err) {
        next(err)
    }
})

export default router