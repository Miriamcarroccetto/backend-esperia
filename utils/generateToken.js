import jwt from 'jsonwebtoken';
const jwtSecretKey = process.env.JWT_SECRET_KEY

export const generateToken = (payload) => {
    return jwt.sign(payload, jwtSecretKey, { expiresIn: '60d' })
}

export default generateToken