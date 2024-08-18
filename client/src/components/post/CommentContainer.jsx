import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from "dompurify";
import CommentCard from "./CommentCard.jsx";

const CommentContainer = ({ postId }) => {
  const [comment, setComment] = useState({ content: "" });
  const [comments, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  // const { user } = useContext(AuthContext)


  const handleInputChange = (e) => {
    setComment({ ...comment, content: e });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const comment_content = {
        comment_content: DOMPurify.sanitize(comment.content),
      };

      const response = await axios.post(
        `http://localhost:3000/api/comments/post/${post._id}`,
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

      const { newComment } = response.data;
      setCommentsList([...comments, newComment]);
      setComment({ ...comment, content: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/post/${postId}`,
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


  return(
  <div className="m-5 border border-black p-5">
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-2 border border-black p-5"
    >
      <div className="flex w-[25rem] flex-col">
        <label htmlFor="content">Comment:</label>
        <ReactQuill
          id="content"
          name="content"
          value={comment.content}
          onChange={handleInputChange}
          required
        />
      </div>

      <button
        className="rounded border border-blue-700 bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        type="submit"
      >
        Comment
      </button>
    </form>

    <div>
      {comments.map((commentItem)=>(
        <CommentCard key={commentItem._id} commentProp={commentItem} />
      ))}
    </div>

  </div>
  )

};

export default CommentContainer;
