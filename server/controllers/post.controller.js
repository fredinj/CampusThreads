const Post = require("../models/post.model");
const Category = require("../models/category.model")
const mongoose = require('mongoose');
const { User } = require ("../models/user.model")

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) return res.status(400).send({ message: 'Invalid post ID' });

  try {
    const post = await Post.findById(postId);
    res.status(200).send(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserHomePosts = async (req, res) => {
  const { postLimit = 3, postSkip = 0 } = req.query;

  const user = await User.findById(req.user._id)
  const userCategories = user.categories;

  try {
    const limit = parseInt(postLimit);
    const skip = parseInt(postSkip);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found." });

    const result = await Post.aggregate([
      {
        $match: {
          category_id: { $in: userCategories.map(id => new mongoose.Types.ObjectId(id)) }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $facet: {
          paginatedResults: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            {
              $count: 'count'
            }
          ]
        }
      }
    ]);

    const posts = result[0].paginatedResults;
    const totalPosts = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const hasMorePosts = totalPosts > (skip + posts.length);

    res.status(200).json({
      posts,
      totalPosts,
      hasMorePosts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { postLimit = 10, postSkip = 0 } = req.query;

  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    // Convert postLimit and postSkip to integers
    const limit = parseInt(postLimit);
    const skip = parseInt(postSkip);

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch posts for the specific category with pagination
    const posts = await Post.find({ category_id: categoryId })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total number of posts in this category
    const totalPosts = await Post.countDocuments({ category_id: categoryId });

    // Calculate if there are more posts
    const hasMorePosts = totalPosts > (skip + posts.length);

    // Prepare the response object
    const response = {
      posts: posts,
      totalPosts: totalPosts,
      hasMorePosts: hasMorePosts,
      category: category.name // Assuming the category has a 'name' field
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addPost = async (req, res) => {
  try {
    const { file } = req;
    const newPost = new Post({
      ...req.body,
      image_url: file ? file.path : null, // filepath if exists or null
      author_id: req.user._id
    });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) return res.status(400).send({ message: 'Invalid post ID' });

  try {
    const { file } = req;
    const updatedContent = {
      ...req.body,
      image_url: file ? file.path : req.body.image_url ? req.body.image_url : null , // filepath if exists or null
      author_id: req.user._id
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');
    
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedContent, { new: true });
    res.status(200).json( updatedPost );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) return res.status(400).send({ message: 'Invalid post ID' });
  
  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getPostsByCategory,
  getUserHomePosts
};
