import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import 'dotenv/config';



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const storageCloud = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'cloud-upload',
      format: async (req, file) => 'png',
      public_id: (req, file) => file.originalname,
    },
  });

  
export { cloudinary, storageCloud }