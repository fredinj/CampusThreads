const Comment = require("../models/comment.model");
const Post = require("../models/post.model")
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { comment_content, parent_comment = null  } = req.body;

  if (comment_content === '') return res.status(200)


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
    const fetchComments = async (parentId, currentDepth, isTopLevel) => {
      if (currentDepth > depth) return [];

      const options = {
        limit: isTopLevel ? parseInt(topLevelLimit) : parseInt(childLimit),
        skip: isTopLevel ? parseInt(topLevelSkip) : parseInt(childSkip),
        sort: { createdAt: 1 },
        lean: true,
      };

      const comments = await Comment.find({
        post: postId,
        parent_comment: parentId
      })
        .skip(options.skip)
        .limit(options.limit)
        .sort(options.sort)
        .lean();

      for (let comment of comments) {
        const totalChildComments = await Comment.countDocuments({ parent_comment: comment._id });
        const childComments = await fetchComments(comment._id, currentDepth + 1, false);
        comment.child_comments = childComments;
       
        const fetchedChildCount = childComments.length;
        comment.totalChildComments = totalChildComments;
        comment.hasMoreComments = totalChildComments > (parseInt(childSkip) + fetchedChildCount);
      }

      return comments;
    };

    const comments = await fetchComments(parentCommentId, 1, true);

    // Get total number of comments for the given parent (or top-level if parentCommentId is null)
    const totalComments = await Comment.countDocuments({
      post: postId,
      parent_comment: parentCommentId
    });

    // Get total number of top-level comments for the given parent
    const totalTopLevelComments = await Comment.countDocuments({
      post: postId,
      parent_comment: parentCommentId
    });

    const fetchedCount = comments.length;
    const hasMoreComments = totalTopLevelComments > (parseInt(topLevelSkip) + fetchedCount);

    res.status(200).json({
      comments: comments,
      totalComments: totalComments,
      hasMoreComments: hasMoreComments
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
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) return res.status(400).send({ message: 'Invalid comment ID' });

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    // Update the comment instead of deleting it
    comment.comment_content = "[deleted]"
    // comment.author = "[deleted]"
    comment.is_deleted = true // Add a flag to indicate the comment is deleted

    // console.log(comment)

    await comment.save()

    res.status(200).json({ message: "Comment marked as deleted", comment: comment });
  } catch (error) {
    res.status(500).json({ message: "Comment deletion failed", error: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};