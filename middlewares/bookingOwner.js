import Booking from '../models/bookingSchema.js';

const bookingOwner = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Prenotazione non trovata' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Non autorizzato ad accedere a questa prenotazione' });
        }

        next();
    } catch (err) {
        next(err);
    }
};

export default bookingOwner;
