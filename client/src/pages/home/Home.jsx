import React, { useRef, useEffect, useState, useContext } from "react";
import PostCard from "../../components/home/PostCard"; // Import the PostCard component
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
// import DOMPurify from 'dompurify';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // using auth context
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthContext
      navigate("/"); // Redirect to the home page or any other page
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/posts", {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      
      setPosts(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center mt-4">
      <nav>
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

export default Home;
