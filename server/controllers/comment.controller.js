const Comment = require("../models/comment.model");
const Post = require("../models/post.model")
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { comment_content } = req.body;

  if (!isValidObjectId(req.params.postId)) return res.status(400).send({ message: 'Invalid request ID' });
  
  try {
    const post = await Post.findById(postId)
    if(!post) return res.status(404).json( {message: "Post not found"} )

    const newComment = new Comment({
      comment_content: comment_content,
      author: req.user.firstName + " " + req.user.lastName,
      author_id: req.user._id,
      post: postId
    });

    console.log(req.user.firstName + "" + req.user.lastName)

    await newComment.save();
    res.status(201).json({newComment});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  const {postId} = req.params
  if (!isValidObjectId(req.params.postId)) return res.status(400).send({ message: 'Invalid post ID' });
  
  try{
    const comments = await Comment.find({ post: postId })
    res.status(200).json( comments );
  } catch (error) {
    res.status(500).json({message: "Error getting comments", error: error.message})
  }
}

const updateComment = async (req, res) => {
  const { commentId } = req.params
  const { comment_content } = req.body;
  
  if (!isValidObjectId(commentId)) return res.status(400).send({ message: 'Invalid comment ID' });

  try {
    const comment = await Comment.findById(commentId);

    if(!comment) return res.status(404).json({message: "Comment not found"});
    if (comment.author.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    comment.comment_content = comment_content;
    await comment.save();
    res.status(200).json({ comment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteComment = async (req, res) => {
  const { commentId } = req.params
  if (!isValidObjectId(commentId)) return res.status(400).send({ message: 'Invalid request ID' });

  try{
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found"} )
    if (comment.author.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');
    await Comment.deleteOne({ _id:commentId });
    res.status(200).json({ message: "Comment deleted" })
  } catch (error) {
    res.status(500).json({ message: "Comment deletion failed", error: error })
  }
}

module.exports = {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};