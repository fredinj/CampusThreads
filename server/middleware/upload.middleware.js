const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

// Create folder if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads");
mkdirp.sync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the folder exists (this is redundant with mkdirp above, but kept for safety)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use the imageID from the URL as the filename, keeping the original extension
    const imageID = req.params.imageID;
    cb(null, `${imageID}${path.extname(file.originalname)}`);
  },
});


const uploadMiddleware = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // limit file size to 5MB
  }
}).single("file");


// Initialise multer with storage config and file filter
const upload = (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: 0, error: 'File size is too large. Max limit is 5MB' });
      }
      return res.status(400).json({ success: 0, error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ success: 0, error: 'Something went wrong during upload' });
    }
    // Everything went fine.
    next();
  });
};

module.exports = upload;