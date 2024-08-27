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
  try {
    const limit = parseInt(postLimit);
    const skip = parseInt(postSkip);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found." });
    const userCategories = user.categories;

    const result = await Post.aggregate([
      {
        $match: {
          category_id: { $in: userCategories.map(id => new mongoose.Types.ObjectId(id)) },
          is_deleted: { $ne: true } // This line ensures we only get non-deleted posts
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

    // Fetch non-deleted posts for the specific category with pagination
    const posts = await Post.find({ 
      category_id: categoryId,
      // is_deleted: { $ne: true } // This line ensures we only get non-deleted posts
    })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total number of non-deleted posts in this category
    const totalPosts = await Post.countDocuments({ 
      category_id: categoryId,
      // is_deleted: { $ne: true } // Count only non-deleted posts
    });

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
    const newPost = new Post({
      ...req.body,
      author: req.user.firstName + " " + req.user.lastName,
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
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    // Only update fields that are allowed to be updated
    const allowedUpdates = ['post_title', 'post_content', 'category_id'];
    const updatedContent = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updatedContent[field] = req.body[field];
      }
    });

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedContent, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const deletePost = async (req, res) => {
//   const { postId } = req.params;
//   if (!isValidObjectId(postId)) return res.status(400).send({ message: 'Invalid post ID' });
  
//   try {
//     const post = await Post.findById(postId);

//     if (!post) return res.status(404).json({ message: "Post not found" });
//     if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

//     await Post.findByIdAndDelete(postId);

//     return res.status(200).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const deletePost = async (req, res) => {
  const { postId } = req.params;
  console.log(postId)
  if (!isValidObjectId(postId)) return res.status(400).send({ message: 'Invalid post ID' });

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author_id.toString() !== req.user._id.toString()) return res.status(403).send('Unauthorized');

    const deletedContent = {
      time: 0,
      blocks: [
        {
          id: "deleted",
          type: "paragraph",
          data: {
            text: "[deleted]"
          }
        }
      ],
      version: "2.30.5"
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        post_content: deletedContent,
        is_deleted: true,
        author: "[deleted]",
      },
      { new: true }
    );

    return res.status(200).json({ message: "Post marked as deleted successfully", post: updatedPost });
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
