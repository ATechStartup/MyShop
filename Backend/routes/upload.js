const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration (optional, for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for uploading images to Cloudinary
router.post('/', upload.array('images', 20), async (req, res) => {
    try {
        const files = req.files;
        const uploadPromises = files.map(file => {
            const stream = Readable.from(file.buffer);
            return new Promise((resolve, reject) => {
                const cloudinaryStream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                stream.pipe(cloudinaryStream);
            });
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        res.status(200).json({ urls: uploadedUrls });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ message: 'Failed to upload images', error });
    }
});

module.exports = router;
