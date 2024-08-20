const { User } = require('../models/user.model');

const updateUserProfile = async (req, res) => {
  const { _id } = req.user; // Assuming _id is extracted from the token in the auth middleware
  const { firstName, lastName, email } = req.body;

  if (req.user._id.toString() !== req.body._id) return res.status(401).json({message: "different user"})

  try {
    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send(updatedUser);
    
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = {updateUserProfile};
