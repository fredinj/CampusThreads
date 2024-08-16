import React, { useRef, useEffect, useState, useContext } from "react";
import PostCard from "../../components/home/PostCard"; // Import the PostCard component
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import DOMPurify from 'dompurify';

const CategoryFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { categoryId } = useParams();

  // State to handle form inputs
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // using auth context
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle all form input changes including ReactQuill content
  const handleInputChange = (e, editor = false) => {
    const { name, value } = e.target || {};

    if (editor) {
      setForm({ ...form, content: e });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setForm({ ...form, image });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("post_title", DOMPurify.sanitize(form.title));
      formData.append("post_content", DOMPurify.sanitize(form.content));
      formData.append("category_id", categoryId)
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await axios.post(
        "http://localhost:3000/api/posts",
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
      setPosts([...posts, newPost]);
      setForm({ title: "", content: "", image: null });
      fileInputRef.current.value = null;
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthContext
      navigate("/"); // Redirect to the home page or any other page
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/category/${categoryId}/posts`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        

        setPosts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center mt-4">
      <nav>
        <button className="border border-black rounded px-2 py-1 ml-2"
         onClick={ ()=>{ navigate("/") } }>
          Home
        </button>
        <button className="border border-black rounded px-2 py-1 ml-2"
         onClick={ ()=>{ navigate("/categories") } }>
          Categories
        </button>
        <button className="border border-black rounded px-2 py-1 ml-2"
         onClick={ ()=> { navigate("/profile/") } }>
            Profile
        </button>
        <button
          className="border border-black rounded px-2 py-1 ml-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

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
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col w-[25rem]">
            <label htmlFor="content">Content:</label>
            <ReactQuill
              id="content"
              name="content"
              value={form.content}
              onChange={(value) => handleInputChange(value, true)}
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
            Add Post
          </button>
        </form>
      </div>

      <div className="flex flex-col border m-5 p-5">
        {posts.map((post) => (
          <PostCard
          key={post._id}
          post={post}
        />
        ))}
      </div>
    </div>
  );
};

export default CategoryFeed;
