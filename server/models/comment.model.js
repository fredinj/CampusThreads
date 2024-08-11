const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment_content: { type: String, required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  author: {type: String, required: true},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true }
}, { timestamps: true });

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;