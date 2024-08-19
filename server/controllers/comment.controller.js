const Comment = require("../models/comment.model");
const Post = require("../models/post.model")
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

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


const loadMoreComments = async (req, res) => {
  const { postId, parentId } = req.params;
  const { topLevelLimit = 5, topLevelSkip = 0, childLimit = 1, childSkip = 0, parentCommentId = null } = req.query

  if (!isValidObjectId(postId)) {
    return res.status(400).send({ message: 'Invalid post ID' });
  }

  try {

  } catch (error) {
    res.status(500).json({ message: "Error getting comments", error: error.message });
  }
}

const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const {
    topLevelLimit = 5,
    topLevelSkip = 0,
    childLimit = 2,
    childSkip = 0,
    parentCommentId = null,
    depth = 1
  } = req.query;

  if (!isValidObjectId(postId)) {
    return res.status(400).send({ message: 'Invalid post ID' });
  }

  try {
    const fetchComments = async (parentId, currentDepth) => {
      if (currentDepth > depth) return [];
   
      const options = {
        limit: parseInt(parentId ? childLimit : topLevelLimit),
        page: Math.ceil((parentId ? childSkip : topLevelSkip) / (parentId ? childLimit : topLevelLimit)) + 1,
        sort: { createdAt: 1 },
        lean: true,
      };
   
      const result = await Comment.paginate({
        post: postId,
        parent_comment: parentId
      }, options);
   
      const comments = result.docs;
   
      for (let comment of comments) {
        const totalChildComments = await Comment.countDocuments({ parent_comment: comment._id });
        const childComments = await fetchComments(comment._id, currentDepth + 1);
        comment.child_comments = childComments;
        
        const fetchedChildCount = childComments.length;
        comment.totalChildComments = totalChildComments;
        comment.hasMoreChildren = totalChildComments > (childSkip + fetchedChildCount);
    }
    
   
      return comments;
    };

    const comments = await fetchComments(parentCommentId, 1);

    // Get total number of comments for the given parent (or top-level if parentCommentId is null)
    const totalComments = await Comment.countDocuments({
      post: postId,
      parent_comment: parentCommentId
    });
    
    // The rest of the code remains the same
    const fetchedCount = comments.length;
    const skip = parentCommentId ? parseInt(childSkip) : parseInt(topLevelSkip);
    const hasMoreComments = totalComments > (skip + fetchedCount);
    
    res.status(200).json({
      comments: comments,
      ...(parentCommentId === null ? {
        totalComments: totalComments,
        hasMoreComments: hasMoreComments
      } : {})
    });

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
  getCommentsByPost,
  updateComment,
  deleteComment,
  loadMoreComments
};