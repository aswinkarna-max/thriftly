// server/config/cloudinary.js
import cloudinaryModule from 'cloudinary'
import multerStorageCloudinary from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

cloudinaryModule.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const productStorage = new multerStorageCloudinary({
  cloudinary: cloudinaryModule,
  params: {
    folder: 'thriftly/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
})

const certStorage = new multerStorageCloudinary({
  cloudinary: cloudinaryModule,
  params: {
    folder: 'thriftly/certifications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  },
})

export const uploadProductImages = multer({ storage: productStorage })
export const uploadCertImage = multer({ storage: certStorage })
export const cloudinary = cloudinaryModule.v2