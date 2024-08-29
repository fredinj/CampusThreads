const express = require("express");
const router = express.Router();
// const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware");

const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getPostsByCategory,
  getUserHomePosts,
  toggleReaction,
  getPostsByTag,
  fetchTags,
  getTags // Add this handler
} = require("../controllers/post.controller");

// Post Routes
router.get("/home", auth, getUserHomePosts);
router.get("/tag", getPostsByTag); // Route for fetching posts by tag
router.get("/tags", fetchTags);

router.get("/:postId", getPost);
router.get("/", getPosts);
router.post("/", auth, addPost);
router.put("/:postId/react", toggleReaction);
router.put("/:postId", auth, updatePost);
router.delete("/:postId", auth, deletePost);
router.get("/category/:categoryId", getPostsByCategory);

// Route for fetching tags

module.exports = router;
