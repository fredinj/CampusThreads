const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware")
const auth = require("../middleware/auth.middleware");
// const admin = require("../middleware/admin.middleware");
// const teacher = require("../middleware/teacher.middleware");

const { 
  handlePostImageUpload ,
  fetchImage
  } = require("../controllers/upload.controller")

router.post("/image/post/:imageID", auth, upload, handlePostImageUpload)

router.get("/image/:imageID", fetchImage);

module.exports = router;