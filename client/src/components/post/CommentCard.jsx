import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactQuill from "react-quill-new";
// import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "react-quill/dist/quill.core.css"; // Import Quill styles
import "react-quill/dist/quill.bubble.css"; // Import Quill styles
import DOMPurify from "dompurify";
import ReplyCard from "./ReplyCard";
import { IconButton, Typography, Divider, Button } from '@mui/material';
import { Edit, Delete, Reply } from '@mui/icons-material';

const CommentCard = ({ commentProp })=>{

  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState({ ...commentProp });
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isReplying, setIsReplying] = useState(false)
  const [reply, setReply] = useState("")
  const [commentEditContent, setCommentEditContent] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childCount, setChildCount] = useState(0)
  const [fetchedChildCount, setFetchedChildCount] = useState(0)

  const handleSaveComment = (newComment) => {
    setComment({ ...newComment });
    setIsEditingComment(false);
  };

  const handleInputChange = (value) => {
    setCommentEditContent(value);
  };

  const handleReplyComment = async ({ comment_content }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments/post/${comment.post}`,
        {
          comment_content: comment_content,
          parent_comment: comment._id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status !== 201) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }

      setReply(response.data)
      setIsReplying(false)

      const commentWithReply = {
        ...comment,
        child_comments: [...comment.child_comments, response.data],
      };

      setComment(commentWithReply)

    } catch (error) {
      setError(error.message);
    }
  }

  const handleLoadMore = async ()=> {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/post/${comment.post}?topLevelLimit=2&childLimit=2&depth=2&parentCommentId=${comment._id}&topLevelSkip=${fetchedChildCount}`,
        {
          withCredentials: true,
        },
      );

      // console.log(response.data)
      // console.log(response.data.hasMoreComments)

      const newList = {
        ...comment,
        child_comments: [...comment.child_comments, ...response.data.comments],
        hasMoreComments: response.data.hasMoreComments
      };

      // console.log(newList)
      setComment(newList)

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCommentEdit = async (e) => {
    e.preventDefault();

    try {
      const comment_content = {
        comment_content: DOMPurify.sanitize(commentEditContent),
      };

      const response = await axios.put(
        `http://localhost:3000/api/comments/${comment._id}`,
        comment_content,
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
      setCommentEditContent("");

      // const newComment = response.data;
      const newComment = {...comment, ...comment_content }
      // console.log(newComment)
      handleSaveComment(newComment);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteComment = async () => {
    
    const response = await axios.delete(
      `http://localhost:3000/api/comments/${comment._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      },
    );

    const deletedComment = {
      ...comment,
      comment_content: response.data.comment.comment_content,
      author: response.data.comment.author,
      author_id: response.data.comment.author_id,
      is_deleted: response.data.comment.is_deleted
    }

    setComment(deletedComment)
  }

  useEffect(()=> {
    setChildCount(comment.totalChildComments)
    setFetchedChildCount(comment.child_comments.length)
  }, [comment])

  if (error) return <Typography color="error">{error}</Typography>;
  
  return (
    <div className="my-4 p-3 max-w-lg w-full mx-auto flex">
      {/* Left line indicator */}
      <div className="border-l-2 border-gray-300 mr-3"></div>
  
      <div
        className={`flex-1 ${comment.depth > 0 ? `ml-${comment.depth * 4}` : ''}`}
      >
        {!isEditingComment ? (
          <>
            <Link to={`/user/${comment.author_id}`}>
              <Typography
                variant="subtitle2"
                color="primary"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {comment.author}
              </Typography>
            </Link>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="body2"
              component="div"
              dangerouslySetInnerHTML={{ __html: comment.comment_content }}
              sx={{ mb: 2, lineHeight: 1.6, color: 'text.secondary' }}
            />
          </>
        ) : (
          <form
            onSubmit={handleCommentEdit}
            className="flex w-full flex-col items-center gap-2 my-1"
          >
            <div className="flex w-full flex-col">
              <Typography
                component="label"
                htmlFor="content"
                variant="body2"
                className="mb-1 font-semibold"
              >
                Edit Comment:
              </Typography>
              <ReactQuill
                theme="bubble"
                id="content"
                name="content"
                value={commentEditContent}
                onChange={handleInputChange}
                required
              />
            </div>
  
            <Button variant="contained" color="primary" type="submit" className="mt-2">
              Save Comment
            </Button>
          </form>
        )}
  
        <Divider sx={{ my: 2 }} />
  
        <div className="flex gap-2">
          {comment.author_id === user._id && !comment.is_deleted && (
            <IconButton
              color="inherit"
              onClick={() => {
                setIsEditingComment(!isEditingComment);
                setCommentEditContent(comment.comment_content || '');
              }}
              sx={{ fontSize: '20px', padding: '6px' }}
            >
              <Edit fontSize="inherit" />
            </IconButton>
          )}
  
          {!comment.is_deleted && (
            <IconButton
              color="inherit"
              onClick={() => setIsReplying(!isReplying)}
              sx={{ fontSize: '20px', padding: '6px' }}
            >
              <Reply fontSize="inherit" />
            </IconButton>
          )}
  
          {comment.author_id === user._id && !comment.is_deleted && (
            <IconButton
              color="inherit"
              onClick={handleDeleteComment}
              sx={{ fontSize: '20px', padding: '6px' }}
            >
              <Delete fontSize="inherit" />
            </IconButton>
          )}
        </div>
  
        {isReplying && <ReplyCard onReply={handleReplyComment} />}
  
        {comment.child_comments.length > 0 && (
          <div className="mt-2">
            {comment.child_comments.map((childComment) => (
              <CommentCard key={childComment._id} commentProp={childComment} />
            ))}
          </div>
        )}
  
        {comment.hasMoreComments && (
          <Button
            variant="text"
            size="small"
            className="mt-2"
            sx={{ textTransform: 'none' }}
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
  

};
  

export default CommentCard