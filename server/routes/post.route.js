const express = require("express");
const Post = require("../models/post.model");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Initialise multer with storage config
const upload = multer({storage: storage});

// Routes
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", upload.single('image'), addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;