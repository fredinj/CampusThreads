const router = require("express").Router();
const { getUserProfile } = require("../controllers/user.controller");
const auth = require('../middleware/auth.middleware'); 

module.exports = router;