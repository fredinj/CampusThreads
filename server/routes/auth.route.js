const router = require("express").Router();
const { authenticateUser, createUser } = require("../controllers/auth.controller")

router.post("/login", authenticateUser);
router.post("/register", createUser);

module.exports = router;