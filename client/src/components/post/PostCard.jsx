import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThumbUp, Comment, Share } from '@mui/icons-material';
import { Avatar, Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const PostCard = ({ postProp }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(postProp);
  const [open, setOpen] = useState(false);

  const handleReaction = async () => {
    try {
      const reactionContent = {
        userId: user._id,
        postId: postProp._id
      };

      const response = await axios.put(
        `http://localhost:3000/api/posts/${postProp._id}/react`,
        reactionContent,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      setPost(prevPost => ({
        ...prevPost,
        likedByUser: response.data.type,
        post_likes: response.data.post_likes
      }));

    } catch (error) {
      console.log(error);
    }
  };

  const handleShareClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/post/${post._id}`);
    // alert("Link copied to clipboard!");
  };

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
        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
          onClick={handleReaction}
        >
          <ThumbUp fontSize="small" sx={{ color: post.likedByUser ? 'blue' : 'inherit' }} />
          <span>{post.post_likes}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
          onClick={() => navigate(`/post/${post._id}`)}
        >
          <Comment fontSize="small" />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
          onClick={handleShareClick}
        >
          <Share fontSize="small" />
          <span>Share</span>
        </button>
      </div>

      {/* Share Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={window.location.origin + `/post/${post._id}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCopyLink} color="primary">
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PostCard;