import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThumbUp, Comment, Share } from '@mui/icons-material';
import { Avatar, Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Card, CardHeader, CardContent, CardActions, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import axios from "../../api/axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";

const PostCard = ({ postProp }) => {
  // console.log(postProp)
  const colorPalette = [
    '#90323d', // Darker Pink
    '#4c956c', // Darker Peach
    '#c75146', // Darker Mint
    '#012a4a', // Darker Light Mint
    '#294c60', // Darker Blue
    '#007f5f', // Darker Teal
  ];
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(postProp);
  const [open, setOpen] = useState(false);

  // Randomly select a color from the palette
  const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

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

  const handleShareClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/post/${post._id}`);
  };

  return (
    <Card sx={{
      m: 2,
      p: 2,
      borderRadius: 2,
      boxShadow: 2,
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: 4,
      },
      maxWidth: '100%',
      width: '800px',  // Adjusting the width to make it longer
    }}>
      {/* Header Section */}
      <CardHeader
        avatar={
          <Avatar
            alt={post.author}
            src={post.authorAvatarUrl || '/default-avatar.png'}
            sx={{ backgroundColor: randomColor, width: 36, height: 36 }}
          />
        }
        title={
            <Chip
              label={post.author}
              clickable
              sx={{
                color: '#3C6E71',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(60, 110, 113, 0.1)',
                },
              }}
            />
        }
        subheader={`Posted on ${new Date(post.createdAt).toLocaleDateString()}`}
        subheaderTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
      />

      <Divider />

      {/* Post Title */}
      <CardContent sx={{ padding: '8px 16px' }}>
        <Link to={`/post/${post._id}/`} style={{ textDecoration: 'none' }}>
          <h2 style={{
            color: '#284B63',
            fontWeight: 'bold',
            margin: '8px 0',
            fontSize: '1rem',
            transition: 'color 0.3s',
            '&:hover': {
              color: '#007f5f',
            },
          }}>
            {post.post_title}
          </h2>
        </Link>
      </CardContent>

      {/* Footer Section with Icons */}
      <CardActions disableSpacing sx={{ padding: '8px 16px' }}>
        <IconButton onClick={handleReaction} sx={{ color: post.likedByUser ? '#007f5f' : 'inherit', fontSize: '0.875rem' }}>
          <ThumbUp />
          <span style={{ marginLeft: 8 }}>{post.post_likes}</span>
        </IconButton>
        <IconButton onClick={() => navigate(`/post/${post._id}`)} sx={{ fontSize: '0.875rem' }}>
          <Comment />
          <span style={{ marginLeft: 8 }}>Comment</span>
        </IconButton>
        <IconButton onClick={handleShareClick} sx={{ fontSize: '0.875rem' }}>
          <Share />
          <span style={{ marginLeft: 8 }}>Share</span>
        </IconButton>
      </CardActions>

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
    </Card>
  );
};

export default PostCard;
