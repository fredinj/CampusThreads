const Post = require("../models/post.model");
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Invalid request ID' });

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
    const { file } = req;
    const newPost = new Post({
      ...req.body,
      image_url: file ? file.path : null, // filepath if exists or null
      author_id: req.user._id
    });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Invalid request ID' });

  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    const updatedPost = await Post.findById(id);
    res.status(200).json({ updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Invalid request ID' });
  
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

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
