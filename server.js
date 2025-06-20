import express from 'express';
import "dotenv/config";
import cors from 'cors';
import db from './db.js';
import userRoute from './routes/userRoute.js'
import experienceRoute from './routes/experienceRoute.js';
import adminExperienceRoutes from './routes/adminExperienceRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import adminRegister from './routes/adminRegister.js'
import adminBookingRoutes from './routes/adminBookingRoutes.js'
import passport from 'passport';
import googleStrategy from "./middlewares/OauthMiddleware.js";
import errorHandler from './middlewares/errorHandler.js';

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
passport.use('google',googleStrategy)

db()

app.use('/users', userRoute)
app.use('/experiences', experienceRoute)
app.use('/admin/experiences', adminExperienceRoutes)
app.use('/admin/register', adminRegister)
app.use('/bookings', bookingRoutes)
app.use('/admin/bookings', adminBookingRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})