const { User } = require('../models/user.model');
const Category = require("../models/category.model");
const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const updateUserProfile = async (req, res) => {
  const { _id } = req.user; 
  const { firstName, lastName, email } = req.body;

  if (req.user._id.toString() !== req.body._id) return res.status(401).json({message: "Unauthorized access: You do not have permission to perform this action."})

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

const subscribeCategory = async (req, res) => {
  const { categoryId } = req.params
  
  try{
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).send({ message: "User not found." });
    if (user.categories.includes(categoryId)) return res.status(409).send({ message: "User already subscribed" })

    const category = await Category.exists({_id: categoryId})
    if(!category) return res.status(404).send({ message: "Category not found" })

    user.categories.push(categoryId)
    await user.save()
    return res.status(200).send({ message: "Subscribed successfully" })

  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const unsubscribeCategory = async (req, res) => {
  const { categoryId } = req.params

  try{
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).send({ message: "User not found." });
    if (!user.categories.includes(categoryId)) return res.status(409).send({ message: "User not subscribed" })

    const category = await Category.exists({_id: categoryId})
    if(!category) return res.status(404).send({ message: "Category not found" })

    user.categories = user.categories.filter((id) => id.toString() !== categoryId.toString());
    await user.save()
    return res.status(200).send({ message: "Unsubscribed successfully" })
    
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const fetchUserComments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userComments = await Comment.find({ author_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(userComments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
}

const fetchUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch posts by the user and sort them by creation date in descending order
    const userPosts = await Post.find({ author_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

module.exports = {updateUserProfile, subscribeCategory, unsubscribeCategory, fetchUserComments, fetchUserPosts};