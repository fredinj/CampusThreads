import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCard from "./CommentCard.jsx";
import ReplyCard from "./ReplyCard.jsx"

const CommentContainer = ({ postId }) => {
  const [commentsList, setCommentsList] = useState([]);
  const [reply, setReply] = useState({ content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [fetchedTopCount, setFetchedTopCount] = useState(0)
  const [totalTopLevel, setTotalTopLevel] = useState(0)

  const handleReplySubmit = async (comment_content) => {
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
      setLoading(false);
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
      setLoading(false);
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

  if (loading) return <div>Loading Comments...</div>
  if (error) return <div>Error: {error}</div>

  return(
  <div className="m-5 border border-black p-5">

    <ReplyCard onReply={handleReplySubmit}/>

    <div>
      {commentsList.comments.map((commentItem)=>(
        <CommentCard key={commentItem._id} commentProp={commentItem} />
      ))} 
    </div>

    {commentsList.hasMoreComments ? (
      <button
        className="rounded-lg border border-black pl-1 pr-1"
        onClick={handleLoadMore}
      >
        Load More
      </button>
    ) : (<></>)}

  </div>
  )

};

export default CommentContainer;