import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
// import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "react-quill/dist/quill.core.css"; // Import Quill styles
import "react-quill/dist/quill.bubble.css"; // Import Quill styles
import DOMPurify from "dompurify";

const ReplyCard = ({ onReply }) => {
  const [comment, setComment] = useState({ content: "" });
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    setComment({ ...comment, content: e });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const comment_content = {
        comment_content: DOMPurify.sanitize(comment.content),
      };
      onReply(comment_content)
      setComment({ ...comment, content:"" })
    } catch (error) {
      setError(error.message)
    }
  };

  if (error) return <div>{error}</div>

  return(
    <form
    onSubmit={handleSubmit}
    className="flex w-full flex-col items-center gap-2 border border-black p-5"
    >
      <div className="flex w-[25rem] flex-col">
        <label htmlFor="content">Comment:</label>
        <ReactQuill
          theme="bubble"
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
  )
}

export default ReplyCard