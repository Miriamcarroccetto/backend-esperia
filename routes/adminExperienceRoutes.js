import express from "express";
import 'dotenv/config';
import Experience from "../models/experienceSchema.js"
import authMiddleware from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import experienceOwner from "../middlewares/experienceOwner.js";
import multer from 'multer'
import { storageCloud } from "../utils/cloudinaryConfig.js"
import slugify from 'slugify'

const upload = multer({ storage: storageCloud })


const router = express.Router()


//GET

router.get('/my-experiences', [authMiddleware, requireAdmin], async (req, res, next)=> {
  try {
    const myExperiences = await Experience.find({ user: req.user._id})
    res.status(200).json(myExperiences)
  } catch(err) {
    next(err)
  }
})


// POST 

router.post(
  '/',
  [authMiddleware, requireAdmin, upload.single('image')],
  async (req, res, next) => {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Body mancante" });
      }
      let parsedDuration;
      try {
        parsedDuration = JSON.parse(req.body.duration);
        if (typeof parsedDuration !== 'object' || parsedDuration === null) {
          throw new Error("Durata non valida");
        }
      } catch (err) {
        return res.status(400).json({ message: "Durata non valida. Deve essere un oggetto JSON valido." });
      }

      let {
        title,
        category,
        description,
        city,
        price,
        date
      } = req.body;

      let parseDates
      if(typeof date === 'string') {
        parseDates = date.split(',').map(d => new Date(d.trim()))
      } else if (Array.isArray(date)) {
        parseDates = date.map(d => new Date(d))
      } else {
        return res.status(400).json({message: "Formato non valido"})
      }

      const normalizedCategory = slugify(category, {
        lower: true,
        strict: true
      })

      const imageUrl = req.file ? req.file.path : null;
      console.log(req.file)

      const newExperience = new Experience({
        user: req.user._id,
        title,
        category: normalizedCategory,
        description,
        city,
        price,
        date: parseDates,
        duration: parsedDuration,
        image: imageUrl,
      });

      await newExperience.save();
      res.status(201).json(newExperience);

    } catch (err) {
      console.error("Errore nella creazione esperienza:", err.message);
      next(err);
    }
  }
);


// PUT

router.put('/:id', [authMiddleware, requireAdmin, experienceOwner, upload.single('image')], async (req, res, next) => {
  try {

    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Esperienza non trovata' });
    }

    const { title, category, description, city, price, duration, date } = req.body;

   
    if (title) experience.title = title;
    if (category) experience.category = category;
    if (description) experience.description = description;
    if (city) experience.city = city;
    if (price) experience.price = price;
    if (req.body.date) {
      let updatedDates
      if (typeof req.body.date === 'string') {
        updatedDates = req.body.date.split(',').map(d => new Date(d.trim()))
      } else if (Array.isArray(req.body.date)) {
        updatedDates = req.body.date.map(d=> new Date(d))
      } else {
        return res.status(400).json({message: "Formato date non valido"})
      }
      experience.date = updatedDates
    }

    
    if (duration) {
      experience.duration = typeof duration === 'string' ? JSON.parse(duration) : duration;
    }

  
    if (req.file) {
      experience.image = req.file.path;
    }

    const updatedExperience = await experience.save();
    res.status(200).json(updatedExperience);

  } catch (err) {
    next(err);
  }
});


// DELETE

router.delete('/:id', [authMiddleware,  requireAdmin, experienceOwner], async(req,res,next)=> {
    
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id)
    if(!experience) return res.status(404).json({error: 'Esperienza non trovata'})
        res.status(200).json({ message: 'Esperienza eliminata con successo'})

    } catch (err) {
        next(err)
    }
})




export default router