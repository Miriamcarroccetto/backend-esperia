import express from "express";
import 'dotenv/config';
import User from "../models/userSchema.js";
import { login } from "../middlewares/authController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";
import passport from "passport";

const saltRounds = parseInt(process.env.SALT_ROUNDS)

const router = express.Router()

//LOGIN

router.post('/login', login)

//GOOGLE LOGIN

router.get('/auth/googlelogin', passport.authenticate("google", {scope:["profile", "email"]}))

router.get('/auth/callback', passport.authenticate("google", {session: false, failureRedirect: '/login'}),
(req, res, next) => {
      try {
        const token = req.user.accessToken
        
       res.redirect(`http://localhost:5173/home?token=${token}`)

       if (!token) {
        return res.status(400).json({ message: "Token non trovato" });
      }
    } catch (err) {
      next(err)
    }
})


// GET USERS

router.get('/', async (req, res, next) => {

    try {
        const users = await User.find()
        res.status(200).json(users)

    } catch (err) {
        next(err)
    }
})

// GET PROFILE ME

router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: 'Non autorizzato' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
})

// GET WITH ID

router.get('/:id', async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'Utente non trovato' })
        res.status(200).json(user)

    } catch (err) {
        next(err)
    }
})



// POST (register)

router.post('/register', async (req, res, next) => {
    const { name, lastname, email, birthday, password } = req.body

    try {

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email già registrata" })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            lastname,
            email,
            birthday,
            password: hashedPassword,
            isAdmin: false
        })

        await newUser.save()

        const token = generateToken({ id: newUser._id, email: newUser.email })

        res.status(201).json({ token })
    } catch (err) {
        next(err)
    }
})


// PUT

router.put('/:id', authMiddleware, async (req, res, next) => {

    try {
        if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Non autorizzato' })
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!user) return res.status(404).json({ error: 'Utente non trovato' })


        res.status(200).json(user)

    } catch (err) {
        next(err)
    }
})

//DELETE

router.delete('/:id', authMiddleware, async (req, res, next) => {

    try {
        if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Non autorizzato' })
        }
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) return res.status(404).json({ error: 'Utente non trovato' })


        res.status(200).json({ message: 'Utente eliminato con successo' })

    } catch (err) {
        next(err)
    }
})

export default router