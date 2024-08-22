const router = require("express").Router();
const auth = require('../middleware/auth.middleware'); 
const { User } = require("../models/user.model"); // Adjust the path as needed
const {
  updateUserProfile,
  subscribeCategory,
  unsubscribeCategory
  } = require('../controllers/user.controller');

// PUT /api/user/update
router.put("/update", auth, updateUserProfile);

// http://localhost:3000/api/user/category/${categoryId}/unsubscribe

router.put("/category/:categoryId/unsubscribe", auth, unsubscribeCategory)
router.put("/category/:categoryId/subscribe", auth, subscribeCategory)

module.exports = router;