const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware")

const { addComment, getCommentsByPost, updateComment, deleteComment, loadMoreComments} = require("../controllers/comment.controller.js")

// Comment Routes
router.post('/post/:postId', auth, addComment);
router.get('/post/:postId', getCommentsByPost);
router.put('/:commentId', auth, updateComment);
router.delete('/:commentId', auth, deleteComment);
router.get("/post/:id/more", auth, loadMoreComments)

module.exports = router;