import path from "path"
import fs from "fs";
import express from "express"
import multer from "multer"
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary"
const router = express.Router()

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, "uploads/")
  },
  filename(req, file, cb){
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("Images only!"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
})

router.post("/", upload.single("image"), async (req, res)=>{
  try {
    const file = req.file.path;
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: 'profile_pictures', // specify folder in Cloudinary
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });
    
    fs.unlinkSync(filePath); // Delete the local file after upload

    res.status(200).json({
      message: "Image Uploaded",
      image: `/${req.file.path}`,
      secure_url: result.secure_url
    })
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed', details: error });
  }
})

export default router