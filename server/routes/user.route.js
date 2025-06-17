const router = require("express").Router();
const auth = require('../middleware/auth.middleware'); 
const { User } = require("../models/user.model"); // Adjust the path as needed
const {
  updateUserProfile,
  subscribeCategory,
  unsubscribeCategory,
  fetchUserComments,
  fetchUserPosts
  } = require('../controllers/user.controller');

// PUT /api/user/update
router.put("/update", auth, updateUserProfile);

// /api/user/category/${categoryId}/unsubscribe

// after /api/user
router.put("/category/:categoryId/unsubscribe", auth, unsubscribeCategory)
router.put("/category/:categoryId/subscribe", auth, subscribeCategory)
router.get('/comments/:userId/', fetchUserComments);
router.get('/posts/:userId/', fetchUserPosts);
module.exports = router;