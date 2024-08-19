import React, { useState, useEffect } from "react";
// import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import CommentCard from "./CommentCard.jsx";
import ReplyCard from "./ReplyCard.jsx"

const CommentContainer = ({ postId }) => {
  const [comments, setCommentsList] = useState([]);
  const [comment, setComment] = useState({ content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [childCommentCount, setChildCommentCount] = useState(0)
  // const { user } = useContext(AuthContext)

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
      setCommentsList(prevState => ({
        ...prevState,
        comments: [...prevState.comments, savedComment],
        totalTopLevelComments: prevState.totalTopLevelComments + 1
      }));
      setComment({ ...comment, content: "" });
    } catch (error) {
      setError(error.message);
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/post/${postId}?topLevelLimit=4&childLimit=2&depth=3`,
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

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <div>Loading Comments...</div>
  if (error) return <div>Error: {error}</div>

  return(
  <div className="m-5 border border-black p-5">

    <ReplyCard onReply={handleReplySubmit}/>

    <div>
      {comments.comments.map((commentItem)=>(
        <CommentCard key={commentItem._id} commentProp={commentItem} />
      ))}
    </div>

    {comments.hasMoreComments ? (
      <button
        className="rounded-lg border border-black pl-1 pr-1"
      >
        Load More
      </button>
    ) : (<></>)}

  </div>
  )

};

export default CommentContainer;
