import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentContainer from "../../components/post/CommentContainer";
import { AuthContext } from "../../contexts/AuthContext";
import MainPostCard from "../../components/post/MainPostCard";
import Navbar from "../../components/navbar/Navbar";
import LoadingIndicator from "../../components/ui/LoadingIndicator";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [loadingPost, setLoadingPost] = useState(true);
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
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    loadingPost ? ( <div className="flex flex-col items-center justify-center w-full"><LoadingIndicator /> </div>) : (

    <div className="w-full min-h-screen bg-zinc-100 p-5">

      <Navbar home={true} categoryButtonName={post.category_name} categoryId={post.category_id} />

      <div className="flex flex-col items-center">

        <MainPostCard key={post._id} postProp={post} />

        <CommentContainer postId={post._id} />

      </div>

    </div>
  )

  );
};

export default PostPage;
