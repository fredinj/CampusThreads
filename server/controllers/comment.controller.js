const Comment = require("../models/comment.model");
const Post = require("../models/post.model")
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { comment_content, parent_comment = null  } = req.body;

  console.log(req.body)

  if (!isValidObjectId(req.params.postId)) return res.status(400).send({ message: 'Invalid request ID' });
  
  try {
    const post = await Post.findById(postId)
    if(!post) return res.status(404).json( {message: "Post not found"} )

    const newComment = new Comment({
      comment_content: comment_content,
      author: req.user.firstName + " " + req.user.lastName,
      author_id: req.user._id,
      post: postId,
      parent_comment: parent_comment
    });

    const savedComment = await newComment.save();

    if (parent_comment) {
      const parent = await Comment.findById(parent_comment);
      if (parent) {
        parent.child_comments.push(savedComment._id);
        await parent.save();
      }
    } 

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByPostInitial = async (req, res) => {
  const { postId } = req.params;
  const { topLevelLimit = 5, topLevelSkip = 0, childLimit = 5, childSkip = 0, parentCommentId = null } = req.query;

  if (!isValidObjectId(postId)) {
    return res.status(400).send({ message: 'Invalid post ID' });
  }

  try {
    // Fetch top-level comments
    const topLevelComments = await Comment.find({ post: postId, parent_comment: parentCommentId })
      .sort({ createdAt: 1 })
      .limit(parseInt(topLevelLimit))
      .skip(parseInt(topLevelSkip))
      .lean();

    // Fetch child comments for each top-level comment
    const topLevelCommentIds = topLevelComments.map(comment => comment._id);
    
    // Count total child comments for pagination purposes
    const childCommentsCountPromises = topLevelCommentIds.map(id => 
      Comment.countDocuments({ parent_comment: id })
    );
    const childCommentsCounts = await Promise.all(childCommentsCountPromises);

    // Fetch child comments
    const childComments = await Comment.find({ parent_comment: { $in: topLevelCommentIds } })
      .sort({ createdAt: 1 })
      .limit(parseInt(childLimit))
      .skip(parseInt(childSkip))
      .lean();

    // Create a map of top-level comments by their ID
    const commentsMap = new Map(topLevelComments.map(comment => {
      comment.child_comments = [];
      comment.hasMoreChildren = false; // Add a flag to indicate more children
      return [comment._id.toString(), comment];
    }));

    // Add child comments to their respective parent comments
    childComments.forEach(child => {
      const parentId = child.parent_comment.toString();
      if (commentsMap.has(parentId)) {
        commentsMap.get(parentId).child_comments.push(child);
      }
    });

    // Check if there are more child comments
    topLevelCommentIds.forEach((id, index) => {
      const totalChildCount = childCommentsCounts[index];
      if (totalChildCount > parseInt(childSkip) + parseInt(childLimit)) {
        commentsMap.get(id.toString()).hasMoreChildren = true;
      }
    });

    // Convert map values to an array
    const commentsWithChildren = Array.from(commentsMap.values());

    res.status(200).json(commentsWithChildren);
  } catch (error) {
    res.status(500).json({ message: "Error getting comments", error: error.message });
  }
};




const updateComment = async (req, res) => {
  const { commentId } = req.params
  const { comment_content } = req.body;

  if (!isValidObjectId(commentId)) return res.status(400).send({ message: 'Invalid comment ID' });

  try {
    const comment = await Comment.findById(commentId);

    if(!comment) return res.status(404).json({message: "Comment not found"});
    if (comment.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    comment.comment_content = comment_content;
    await comment.save();
    res.status(200).json( comment )
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
    if (comment.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');
    await Comment.deleteOne({ _id:commentId });
    res.status(200).json({ message: "Comment deleted" })
  } catch (error) {
    res.status(500).json({ message: "Comment deletion failed", error: error })
  }
}

module.exports = {
  addComment,
  getCommentsByPostInitial,
  updateComment,
  deleteComment,
};