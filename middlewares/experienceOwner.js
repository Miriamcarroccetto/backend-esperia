import Experience from "../models/experienceSchema.js";

const experienceOwner = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Esperienza non trovata' });
    }
   
    if (experience.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    next();
  } catch (err) {
    console.error("Errore nel middleware experienceOwner:", err);
    return res.status(500).json({ error: 'Errore interno nel controllo proprietà esperienza' });
  }
};


export default experienceOwner
