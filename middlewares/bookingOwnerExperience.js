import Booking from "../models/bookingSchema.js";

const bookingOwnerExperience = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('experience');
    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    
    if (booking.experience.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    next();
  } catch (err) {
    console.error("Errore nel middleware bookingOwnerExperience:", err);
    return res.status(500).json({ error: 'Errore interno nel controllo proprietà esperienza' });
  }
};

export default bookingOwnerExperience;
