const router = require("express").Router();
const auth = require('../middleware/auth.middleware'); 
const { User } = require("../models/user.model"); // Adjust the path as needed
const {updateUserProfile} = require('../controllers/user.controller');

// PUT /api/user/update
router.put("/update", auth, updateUserProfile);

module.exports = router;