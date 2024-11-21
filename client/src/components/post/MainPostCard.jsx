import React, { useRef, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";
import RichTextEditor from "../editorjs/RichTextEditor";
import { ThumbUp, Comment, Share, Edit, Delete } from "@mui/icons-material";
import { Avatar, Chip, Divider, IconButton, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const MainPostCard = ({ postProp, handleReplyToggle }) => {
  const [post, setPost] = useState({ ...postProp });
  const [postTitle, setPostTitle] = useState(postProp.post_title || "");
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSavePost = (newPost) => {
    setPost(prevPost => ({
      ...prevPost,
      ...newPost
    }));
    setIsEditingPost(false);
  };

  const handlePostDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/posts/${post._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      );

      setPost(response.data.post);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // console.log(post.post_content)
  }, [post]);

  const handleReaction = async () => {
    try {
      const reactionContent = {
        userId: user._id,
        postId: postProp._id
      };

      const response = await axios.put(
        `/api/posts/${postProp._id}/react`,
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

  const handlePostEdit = async (dataFromEditor) => {
    const postData = {
      "post_title": postTitle,
      "post_content": dataFromEditor,
      "category_id": post.category_id
    };

    try {
      const response = await axios.put(
        `/api/posts/${post._id}`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status !== 200) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }

      const newPost = response.data;

      handleSavePost(newPost);
    } catch (error) {
      setError(error.message);
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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-4 mt-10 flex flex-col rounded-lg border border-gray-300 bg-white p-5 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-5xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Avatar
            alt={post.author}
            src={post.authorAvatarUrl || "/default-avatar.png"}
            className="mr-3"
          />
          <div>
              <Chip
                label={post.author}
                clickable
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  padding: 0,
                }}
              />
            <p className="text-sm text-gray-500">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tag displayed as a Chip if it exists */}
        {post.tag && (
          <Chip label={post.tag} color="primary" className="ml-auto" />
        )}
      </div>

      <Divider />

      {/* Post Title */}
      {!isEditingPost ? (
        <div className="mt-3 mb-3 max-w-full">
          <h2 className="text-gray-800 font-semibold mt-3 mb-3">
            {post.post_title}
          </h2>

          <RichTextEditor
            key={JSON.stringify(post.post_content)}
            INITIAL_DATA_PROP={post.post_content}
            onSave={handlePostEdit}
            readOnly={true}
            isEditingPost={isEditingPost}
          />
        </div>
      ) : (
        <div className="mt-3 mb-3 max-w-full">
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <RichTextEditor
            INITIAL_DATA_PROP={post.post_content}
            onSave={handlePostEdit}
            isEditingPost={isEditingPost}
            buttonText="Save Post"
          />
        </div>
      )}

      <Divider />

      {/* Footer Section with Action Icons */}
      <div className="mt-3 flex items-center justify-between text-gray-600">
        <div className="flex space-x-4 items-center">
          <IconButton
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            onClick={handleReaction}
          >
            <ThumbUp
              fontSize="small"
              sx={{ color: post.likedByUser ? "blue" : "inherit" }}
            />
            <span className="ml-2 text-sm"> {post.post_likes} </span>
          </IconButton>
          <IconButton
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            onClick={handleReplyToggle}
          >
            <Comment fontSize="small" />
          </IconButton>
          <IconButton
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            onClick={handleShareClick}
          >
            <Share fontSize="small" />
          </IconButton>
        </div>

        {post.author_id === user._id && !post.is_deleted && (
          <div className="flex space-x-2">
            <IconButton
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsEditingPost(!isEditingPost)}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              className="text-gray-600 hover:text-red-600 transition-colors duration-200"
              onClick={handlePostDelete}
            >
              <Delete fontSize="small" />
            </IconButton>
          </div>
        )}
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

export default MainPostCard;