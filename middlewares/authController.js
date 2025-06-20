import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';


const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email non valida" });
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) {
      return res.status(400).json({ message: "Password non valida"})
    }
   
    const token = jwt.sign({
          id: user._id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        isAdmin: user.isAdmin
    }, jwtSecretKey,
      { expiresIn: '60d' })


      return res.status(200).json({
      message: "Login effettuato con successo",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};
