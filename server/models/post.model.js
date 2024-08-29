const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  post_title: {
    type: String,
    required: true,
  },
  post_content: {
    type: Object,
    required: true,
  },
  post_likes: {
    type: Number,
    default: 0, // Default value for likes
  },
  // author: {type: String, required: true},
  author: {type: String, required: true}, // set to required later
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true},
  is_deleted: {type: Boolean, default: false },
  category_name: {type: String, required: true},
  tag: {type: String, default:""}
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;