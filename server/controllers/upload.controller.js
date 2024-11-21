const fs = require('fs').promises;
const path = require("path");

const handlePostImageUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, error: 'No file uploaded or file is not an image.' });
  }
  try {
    return res.status(200).json({
      success: 1,
      file: {
        url: `/api/uploads/image/${req.file.filename}`,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: 0, error: 'Server error during upload processing' });
  }
};

const fetchImage = async (req, res) => {
  const imagePath = path.join(__dirname, "..", "uploads", req.params.imageID);
  try {
    await fs.access(imagePath);
    res.sendFile(imagePath);
  } catch (error) {
    res.status(404).json({ success: 0, error: 'Image not found' });
  }
};

module.exports = {
  handlePostImageUpload,
  fetchImage
};