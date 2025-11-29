const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'card_blog_images',      // Cloudinary folder
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'tiff'],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
