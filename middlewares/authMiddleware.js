import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from "../models/userSchema.js";

const jwtSecretKey = process.env.JWT_SECRET_KEY

const verifyJWT = (token)=> {
    return new Promise((res, rej)=> {
        jwt.verify(token, jwtSecretKey, (err, data)=> {
            if(err) rej(err)
                else res(data)
        })
    })
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token mancante o malformato' })
    }

    const token = authHeader.split(' ')[1].trim()
    const decoded = await verifyJWT(token)

    if (!decoded?.id) {
      return res.status(401).json({ error: 'Token non valido. Effettua nuovamente il login.' })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'Utente non trovato' })
    }

    req.user = user
    next()

  } catch (err) {
    return res.status(401).json({ error: 'Token scaduto o non valido' })
  }
};

export default authMiddleware