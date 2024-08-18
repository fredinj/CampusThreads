const { User } = require('../models/user.model');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Assuming you're using JWT and req.user is populated
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

module.exports = { getUserProfile };
