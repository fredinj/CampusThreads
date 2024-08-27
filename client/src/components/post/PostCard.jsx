import React from "react";
import { Link } from "react-router-dom";
import { ThumbUp, Comment, Share } from '@mui/icons-material';
import { Avatar, Chip } from '@mui/material';
import Divider from '@mui/material/Divider';


const PostCard = ({ post }) => {
  return (
    <div className="m-4 flex flex-col rounded-lg border border-gray-300 bg-white p-5 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-xl">
      {/* Header Section */}
      <div className="flex items-center mb-3">
        {/* Avatar */}
        <Avatar
          alt={post.author}
          src={post.authorAvatarUrl || '/default-avatar.png'}
          className="mr-3"
        />
        <div>
          {/* Author Name */}
          <Link to={`/user/${post.author_id}`}>
            <Chip
              label={post.author}
              clickable
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200"
              sx={{
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                padding: 0,
              }}
            />
          </Link>
          {/* Post Time */}
          <p className="text-sm text-gray-500">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <Divider />

      {/* Post Title */}
      <Link to={`/post/${post._id}/`}>
        <h2 className="text-gray-800 font-semibold mt-3 mb-3 hover:text-blue-600 transition-colors duration-200">
          {post.post_title}
        </h2>
      </Link>

      {/* Footer Section with Icons */}
      <div className="mt-3 flex items-center space-x-4 text-gray-600">
        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
          <ThumbUp fontSize="small" />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
          <Comment fontSize="small" />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
          <Share fontSize="small" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
