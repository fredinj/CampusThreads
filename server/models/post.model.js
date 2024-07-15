const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  post_id: {
    type: String,
    required: true,
    unique: true, // Assuming post_id should be unique
  },
  post_title: {
    type: String,
    required: true,
  },
  post_content: {
    type: String,
    required: true,
  },
  post_likes: {
    type: Number,
    default: 0, // Default value for likes
  },
  post_dislikes: {
    type: Number,
    default: 0, // Default value for dislikes
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
