const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

// Routes
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", upload.single("image"), addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
