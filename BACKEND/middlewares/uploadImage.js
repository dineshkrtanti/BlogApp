const multer = require("multer");

// Store file in memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (optional)
});

module.exports = upload;
