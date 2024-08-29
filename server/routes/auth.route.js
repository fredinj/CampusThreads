const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { loginUser, createUser, logoutUser, checkAuth, sendVerificationEmail, verifyUserEmail } = require("../controllers/auth.controller")

router.post("/login", loginUser);
router.post("/signup", createUser);
router.post("/logout", logoutUser);
router.get("/check-auth", checkAuth)
router.put("/send-verify-email", auth, sendVerificationEmail);
router.put("/verify-email", auth, verifyUserEmail);

module.exports = router;