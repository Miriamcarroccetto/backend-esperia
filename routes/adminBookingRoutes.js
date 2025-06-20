import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import experienceOwner from '../middlewares/experienceOwner.js';
import Booking from '../models/bookingSchema.js';
import bookingOwnerExperience from '../middlewares/bookingOwnerExperience.js';

const router = express.Router()


//TUTTE LE PRENOTAZIONI DI UN'ESPERIENZA

router.get('/experience/:id', [authMiddleware, requireAdmin, experienceOwner], async (req, res, next)=> {

    try {
        const bookings = await Booking.find({ experience: req.params.id}).populate('user', 'firstName lastName email').populate('experience', 'title')
        res.status(200).json(bookings)
    } catch (err) {
        next(err)
    }
})

//MODIFICA STATO DI PRENOTAZIONE

router.patch('/:id/status', [authMiddleware, requireAdmin, bookingOwnerExperience], async(req,res, next) => {

    const {status}= req.body

    if(!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Stato non valido' });
    }

    try {
        const booking = await Booking.findByIdAndUpdate( req.params.id, {status}, { new: true, runValidators: true}).populate('user', 'email')

        if(!booking) return res.status(400).json({ error: 'Prenotazione non trovata' })

            return res.status(200).json(booking); 
    } catch (err) {
        next(err);
    }

})

export default router