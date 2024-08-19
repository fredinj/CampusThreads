const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware")

const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");


// Post Routes
router.get("/", getPosts);
router.get("/:postId", getPost);
router.post("/", auth, upload.single("image"), addPost);
router.put("/:postId", auth,upload.single("image"), updatePost);
router.delete("/:postId", auth, deletePost);

module.exports = router;