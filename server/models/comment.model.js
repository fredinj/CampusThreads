const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment_content: { type: String, required: true },
  // author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  author: {type: String, required: true},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true },
  parent_comment: {type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: null },
  child_comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] }],
  is_deleted: {type: Boolean, default: false },
}, 
{ timestamps: true });

commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;