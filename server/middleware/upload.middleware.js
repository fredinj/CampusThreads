const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

// Create folder if it doesn't exist
const uploadDir = "uploads";
mkdirp.sync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialise multer with storage config
const upload = multer({ storage: storage });

module.exports = upload;