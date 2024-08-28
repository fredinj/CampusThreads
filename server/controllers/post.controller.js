const Post = require("../models/post.model");
const Category = require("../models/category.model")
const mongoose = require('mongoose');
const { User } = require ("../models/user.model")
const Reaction = require('../models/reactions.model'); // Assuming this is the path to your Reaction model

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
  const { userId } = req.query

  if (!isValidObjectId(postId)) return res.status(400).send({ message: 'Invalid post ID' });
  
  try {
    const post = await Post.findById(postId).lean();
    
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    let likedByUser = false;
    if (userId && isValidObjectId(userId)) {
      const reaction = await Reaction.findOne({ user: userId, post: postId, type: 'like' });
      likedByUser = !!reaction;
    }

    res.status(200).send({ ...post, likedByUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserHomePosts = async (req, res) => {
  const { postLimit = 3, postSkip = 0 } = req.query;
  const { userId } = req.query;

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
          is_deleted: { $ne: true }
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

    let posts = result[0].paginatedResults;
    const totalPosts = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const hasMorePosts = totalPosts > (skip + posts.length);

    if (userId && isValidObjectId(userId)) {
      const postIds = posts.map(post => post._id);
      const reactions = await Reaction.find({ user: userId, post: { $in: postIds }, type: 'like' });
      
      const likedPostIds = new Set(reactions.map(reaction => reaction.post.toString()));
      
      posts = posts.map(post => ({
        ...post,
        likedByUser: likedPostIds.has(post._id.toString())
      }));
    } else {
      posts = posts.map(post => ({ ...post, likedByUser: false }));
    }

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
  const { userId } = req.query;

  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const limit = parseInt(postLimit);
    const skip = parseInt(postSkip);
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let posts = await Post.find({
      category_id: categoryId,
      is_deleted: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments({
      category_id: categoryId,
      is_deleted: { $ne: true }
    });

    if (userId && isValidObjectId(userId)) {
      const postIds = posts.map(post => post._id);
      const reactions = await Reaction.find({ user: userId, post: { $in: postIds }, type: 'like' });
      
      const likedPostIds = new Set(reactions.map(reaction => reaction.post.toString()));
      
      posts = posts.map(post => ({
        ...post,
        likedByUser: likedPostIds.has(post._id.toString())
      }));
    } else {
      posts = posts.map(post => ({ ...post, likedByUser: false }));
    }

    const hasMorePosts = totalPosts > (skip + posts.length);

    const response = {
      posts: posts,
      totalPosts: totalPosts,
      hasMorePosts: hasMorePosts,
      category: category.name
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addPost = async (req, res) => {
  try {

    const category = await Category.findById(req.body.category_id)

    const newPost = new Post({
      ...req.body,
      author: req.user.firstName,
      author_id: req.user._id,
      category_name: category.name
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

const toggleReaction = async (req, res)=> {
  const { userId, postId } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if a reaction already exists
    const existingReaction = await Reaction.findOne({ user: userId, post: postId }).session(session);

    let updatedPost;

    if (existingReaction) {
      // If reaction exists, remove it and decrement post_likes
      await Reaction.findByIdAndDelete(existingReaction._id).session(session);
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { post_likes: -1 } },
        { new: true, session }
      );
    } else {
      // If reaction doesn't exist, create it and increment post_likes
      const newReaction = new Reaction({
        user: userId,
        post: postId,
        type: 'like' // Assuming we're only handling likes for now
      });
      await newReaction.save({ session });
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { post_likes: 1 } },
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: existingReaction ? 'Reaction removed' : 'Reaction added',
      type: !existingReaction,
      post_likes: updatedPost.post_likes
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error toggling reaction:', error);
    return res.status(500).json({ success: false, message: 'Error toggling reaction', error: error.message });
  }
}

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getPostsByCategory,
  getUserHomePosts,
  toggleReaction
};
