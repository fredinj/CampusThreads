import React, { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from 'dompurify';

const PostEditor = ({ post, onSave }) => {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: post.post_title || "",
    content: post.post_content || "",
    image: "",
  });

  const fileInputRef = useRef(null);
  
  const handleInputChange = (e, editor = false) => {
    if (editor) {
      setForm({ ...form, content: e });
    }
  };

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setForm({ ...form, image });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("post_title",  DOMPurify.sanitize(post.post_title));
      formData.append("post_content",  DOMPurify.sanitize(form.content));
      formData.append("category_id", post.category_id)
      if (form.image) {
        formData.append("image", form.image);
      } else {
        formData.append("image_url", post.image_url)
      }

      // console.log(formData)

      const response = await axios.put(
        `http://localhost:3000/api/posts/${post._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          withCredentials: true, // This ensures cookies are sent with the request
        }
      );

      if (response.status !== 200) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status
        );
      }

      const newPost = response.data;

      // console.log(newPost)

      setForm({ ...form, title: "", content: "", image: null });
      fileInputRef.current.value = null;
      onSave(newPost)
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center mt-4">

      <div className="flex flex-col items-center border border-black p-5 m-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full gap-2"
        >
          <div className="flex flex-col w-[25rem]">
            <label htmlFor="title">Title:</label>
            <input
              className="border border-black rounded p-1"
              type="text"
              id="title"
              name="title"
              value={form.title}
              // onChange={handleInputChange}
              readOnly
              required
            />
          </div>

          <div className="flex flex-col w-[25rem]">
            <label htmlFor="content">Content:</label>
            <ReactQuill
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col w-[25rem]">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          <button
            className="bg-blue-500 text-white font-bold py-1 px-1 rounded border border-blue-700 hover:bg-blue-700"
            type="submit"
          >
            Save Post
          </button>
        </form>
      </div>
    </div>
  );

}

export default PostEditor