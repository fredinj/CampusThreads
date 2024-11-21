import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import ReactQuill from "react-quill-new";
// import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "react-quill/dist/quill.core.css"; // Import Quill styles
import "react-quill/dist/quill.bubble.css"; // Import Quill styles
import DOMPurify from "dompurify";
import { Button, TextField, Box, Typography } from '@mui/material';

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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mt-4 mb-7 items-center gap-4 w-full max-w-xl border border-gray-300 rounded-lg bg-white p-5 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="w-full">
      <ReactQuill
          className="border relative z-10"
          theme="bubble"
          id="content"
          name="content"
          value={comment.content}
          onChange={handleInputChange}
          required
        />
      </div>
  
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="inherit"
        sx={{ px:6, mt: 0, width: '5rem', py: 1, fontWeight: 'bold', borderRadius: '0.5rem', color: 'white', backgroundColor: 'blue.600', '&:hover': { backgroundColor: 'blue.700' }, transition: 'background-color 200ms' }}

      >
        Comment
      </Button>
    </form>
  );
  
  
}

export default ReplyCard