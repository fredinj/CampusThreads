const router = require("express").Router();
const { loginUser, createUser, logoutUser, checkAuth } = require("../controllers/auth.controller")

router.post("/login", loginUser);
router.post("/signup", createUser);
router.post("/logout", logoutUser);
router.get("/check-auth", checkAuth)

module.exports = router;