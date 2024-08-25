import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainPostCard from "../../components/post/MainPostCard";
import CommentContainer from "../../components/post/CommentContainer";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { AuthContext } from "../../contexts/AuthContext";
import MainPostCardTest from "../../components/post/MainPostCardTest";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/posts/${postId}`,
        {
          withCredentials: true,
        },
      );
      setPost(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    // console.log("Updated post:", post);
  }, [post]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center">
      <nav className="mt-4">
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate(`/category/${post.category_id}`);
          }}
        >
          Category
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate(`/profile`);
          }}
        >
          Profile
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <MainPostCardTest key={post._id} postProp={post} />

      <CommentContainer postId={post._id} />

    </div>
  );
};

export default PostPage;
