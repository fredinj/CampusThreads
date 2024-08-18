const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware")

const { addComment, getCommentsByPostInitial, updateComment, deleteComment} = require("../controllers/comment.controller.js")

// Comment Routes
router.post('/post/:postId', auth, addComment);
router.get('/post/:postId', getCommentsByPostInitial);
router.put('/:commentId', auth, updateComment);
router.delete('/:commentId', auth, deleteComment);

module.exports = router;