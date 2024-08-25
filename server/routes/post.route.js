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
  getPostsByCategory,
  getUserHomePosts
} = require("../controllers/post.controller");


// Post Routes
router.get("/home", auth, getUserHomePosts);
router.get("/:postId", getPost);
router.get("/", getPosts);
// router.post("/", auth, upload.single("image"), addPost);
// router.put("/:postId", auth,upload.single("image"), updatePost);
router.delete("/:postId", auth, deletePost);
router.get("/category/:categoryId", getPostsByCategory)

module.exports = router;