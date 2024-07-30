const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

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
  image_url : {
    type: String,
    default: null
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
