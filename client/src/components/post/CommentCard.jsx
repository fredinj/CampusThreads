import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from "dompurify";

const CommentCard = ({ commentProp }) => {
  const { user } = useContext(AuthContext);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [comment, setComment] = useState({ ...commentProp });

  const handleSaveComment = (newComment) => {
    setComment({ ...newComment });
    setIsEditingComment(false);
  };

  const [commentContent, setCommentContent] = useState(
    comment.comment_content || "",
  );
  const [error, setError] = useState(null);

  const handleInputChange = (value) => {
    setCommentContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const comment_content = {
        comment_content: DOMPurify.sanitize(commentContent),
      };

      const response = await axios.put(
        `http://localhost:3000/api/comments/${comment._id}`,
        comment_content,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // This ensures cookies are sent with the request
        },
      );

      if (response.status !== 200) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }
      setCommentContent("");

      const newComment = response.data;
      handleSaveComment(newComment);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return isEditingComment ? (
    <div className="m-5 flex flex-col items-center border border-black p-5">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-2"
      >
        <div className="flex w-[25rem] flex-col">
          <label htmlFor="content">Comment:</label>
          <ReactQuill
            id="content"
            name="content"
            value={commentContent}
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
    </div>
  ) : (
    <div className="m-5 flex flex-col items-center border border-black p-3 rounded-lg">
      <Link to={`/user/${comment.author_id}`}>
        <h4 className="text-blue-500 hover:text-blue-700">
          {comment.author}
        </h4>
      </Link>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: comment.comment_content }}
      />

      {comment.author_id === user._id && (
        <button
          className="rounded-lg border border-black pl-1 pr-1 mt-2"
          onClick={() => setIsEditingComment(!isEditingComment)}
        >
          Edit
        </button>
      )}
    </div>
  )

};

export default CommentCard;
