const express = require("express");
const Post = require("../models/post.model");
const router = express.Router();

const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;