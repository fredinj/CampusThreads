import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCard from "./CommentCard.jsx";
import ReplyCard from "./ReplyCard.jsx"
import LoadingIndicator from "../ui/LoadingIndicator.jsx"
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const isEmptyContent = (htmlContent) => {
  // Parse the HTML content using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Get the text content, replace all whitespace characters, and trim any remaining whitespace
  const textContent = (doc.body.textContent || '').replace(/\s+/g, '').trim();
  return textContent === '';
};

const CommentContainer = ({ postId, commentBox=true }) => {
  const [commentsList, setCommentsList] = useState([]);
  const [reply, setReply] = useState({ content: "" });
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null)
  const [fetchedTopCount, setFetchedTopCount] = useState(0)
  const [totalTopLevel, setTotalTopLevel] = useState(0)

  const handleReplySubmit = async (comment_content) => {
    if (isEmptyContent(comment_content)) return;
    
    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments/post/${postId}`,
        comment_content,
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

      const savedComment = response.data;

      const commentsWithReply = {
        ...commentsList,
        comments: [...commentsList.comments, savedComment]
      }
      setCommentsList(commentsWithReply)
      // setCommentsList(prevState => ({
      //   ...prevState,
      //   commentsList: [...prevState.comments, savedComment],
      //   totalTopLevelComments: prevState.totalTopLevelComments + 1
      // }));
      setReply({ ...reply, content: "" });
    } catch (error) {
      setError(error.message);
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/post/${postId}?topLevelLimit=2&childLimit=3&depth=3`,
        {
          withCredentials: true,
        },
      );
      setCommentsList(response.data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLoadMore = async ()=> {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/post/${postId}?topLevelLimit=2&childLimit=2&depth=3&topLevelSkip=${fetchedTopCount}`,
        {
          withCredentials: true,
        },
      );

      const newList = {
        ...commentsList,
        comments: [...commentsList.comments, ...response.data.comments],
        totalComments: response.data.totalComments,
        hasMoreComments: response.data.hasMoreComments
      };

      setCommentsList(newList)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect( () => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (commentsList.comments) {
      setFetchedTopCount(commentsList.comments.length);
      setTotalTopLevel(commentsList.totalComments);
    }
  }, [commentsList]);

  if (error) return <div>Error: {error}</div>

  return (
    loadingComments ? (
      <LoadingIndicator />
    ) : (
      <div className="flex flex-col items-center mt-4 p-3 border border-gray-300 rounded-lg bg-white w-full max-w-4xl">
        {commentBox && <ReplyCard onReply={handleReplySubmit} />}
  
        {commentsList.comments.length > 0 ? (
          commentsList.comments.map((commentItem) => (
            <CommentCard key={commentItem._id} commentProp={commentItem} />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            No comments yet.
          </Typography>
        )}
  
        {commentsList.hasMoreComments && (
          <Button
            variant="outlined"
            size="small"
            className="mt-2"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        )}
      </div>
    )
  );
  
  

};

export default CommentContainer;