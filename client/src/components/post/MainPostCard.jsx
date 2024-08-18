import React, { useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from "dompurify";
import { AuthContext } from "../../contexts/AuthContext";


const MainPostCard = ({ postProp }) => {
  const [post, setPost] = useState({ ...postProp })
  const { user } = useContext(AuthContext)
  const imageUrl = post.image_url
    ? `http://localhost:3000/images/${post.image_url}`
    : null;

  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: post.post_title || "",
    content: post.post_content || "",
    image: "",
  });

  const fileInputRef = useRef(null);
  const [isEditingPost, setIsEditingPost] = useState(false);

  // Handle all form input changes including ReactQuill content
  const handleInputChange = (e, editor = false) => {
    const { name, value } = e.target || {};

    if (editor) {
      setForm({ ...form, content: e });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setForm({ ...form, image });
    }
  };

  const handleSavePost = (newPost) => {
    setPost({ ...newPost });
    setIsEditingPost(false); //toggled with buttons anyways
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("post_title", DOMPurify.sanitize(post.post_title));
      formData.append("post_content", DOMPurify.sanitize(form.content));
      formData.append("category_id", post.category_id);
      if (form.image) {
        formData.append("image", form.image);
      } else {
        formData.append("image_url", post.image_url);
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
        },
      );

      if (response.status !== 200) {
        throw new Error(
          "Network response was not ok, Status: ",
          response.status,
        );
      }

      const newPost = response.data;

      // console.log(newPost)

      setForm({ ...form, title: "", content: "", image: null });
      fileInputRef.current.value = null;
      handleSavePost(newPost);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  
  return !isEditingPost ? (
    <div className="m-5 flex w-[25rem] flex-col rounded-lg border border-black p-2">
      <Link to={`/user/${post.author_id}`}>
        <h3 className="text-blue-500 hover:text-blue-700">Author</h3>
      </Link>
      <h2 className="font-bold">{post.post_title}</h2>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.post_content }}
      />
      {imageUrl && <img src={imageUrl} alt="Post image" />}

      {post.author_id === user._id && (
        <div className="post-toolbar items-center flex flex-col mt-2">
          <button
            className="rounded-lg border border-black p-2"
            onClick={() => setIsEditingPost(!isEditingPost)}
          >
            Edit Post
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="mt-4 flex flex-col items-center">
      <div className="m-5 flex flex-col items-center border border-black p-5">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center gap-2"
        >
          <div className="flex w-[25rem] flex-col">
            <label htmlFor="title">Title:</label>
            <input
              className="rounded border border-black p-1"
              type="text"
              id="title"
              name="title"
              value={form.title}
              // onChange={handleInputChange}
              readOnly
              required
            />
          </div>

          <div className="flex w-[25rem] flex-col">
            <label htmlFor="content">Content:</label>
            <ReactQuill
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex w-[25rem] flex-col">
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
            className="rounded border border-blue-700 bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Save Post
          </button>
        </form>
      </div>
    </div>
  )
};

export default MainPostCard;
