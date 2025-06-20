import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import bookingOwner from '../middlewares/bookingOwner.js';
import Booking from '../models/bookingSchema.js';

const router = express.Router()

//CREA UNA PRENOTAZIONE

router.post('/', authMiddleware, async (req, res, next)=> {

    const {experience, bookingDate, message} = req.body

    try {
        const booking = new Booking({
            user: req.user._id,
            experience,
            bookingDate,
            message
        })
        await booking.save()
        res.status(201).json(booking)

    } catch (err) {
        next(err)
    }
})

//MODIFICA UNA PRENOTAZIONE 

router.put('/:id', [authMiddleware, bookingOwner], async (req, res, next)=> {

    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators: true
        })
        
        if(!booking) return res.status(404).json({ error: "Prenotazione non trovata"})

            res.status(200).json(booking)
    } catch (err) {
        next(err)
    }
})

//CANCELLA UNA PRENOTAZIONE

router.delete('/:id', [authMiddleware, bookingOwner], async (req,res, next)=> {

    try {
        const booking = await Booking.findByIdAndDelete(req.params.id)
        if(!booking) return res.status(404).json({ error: "Prenotazione non trovata"})

            res.status(200).json({ message: "Prenotazione cancellata"})
    } catch (err) {
        next(err)
    }
})


//PRENOTAZIONI PERSONALI

router.get('/me', authMiddleware, async (req, res, next)=> {

    try {
        const bookings = await Booking.find({ user: req.user._id}).populate('experience')
        res.status(200).json(bookings)
    } catch (err) {
        next (err)
    }
})

export default router
