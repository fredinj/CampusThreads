const Post = require("../models/post.model");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await Post.findById(id);
    res.status(200).json({ updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
};
