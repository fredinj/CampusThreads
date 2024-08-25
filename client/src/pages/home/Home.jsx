import React, { useRef, useEffect, useState, useContext } from "react";
import PostCard from "../../components/home/PostCard"; // Import the PostCard component
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PostCardTest from "../../components/post/PostCardTest";

const Home = () => {
  const [postsData, setPostsData] = useState({
    posts:[],
    hasMorePosts: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedPostsCount, setFetchedPostsCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

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
      const response = await axios.get(`http://localhost:3000/api/posts/home?postSkip=${fetchedPostsCount}&postLimit=3`, {
        withCredentials: true, 
      });

      const newPostsData = {
        ...response.data,
        posts: [...postsData.posts, ...response.data.posts]
      }
      setPostsData(newPostsData);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(()=> {
    if (postsData.posts){
      setFetchedPostsCount(postsData.posts.length)
      setTotalPostsCount(postsData.posts.totalPosts)
    }
  }, [postsData])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-4 flex flex-col items-center">
      <nav>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate("/categories");
          }}
        >
          Categories
        </button>
        <button
          className="ml-2 rounded border border-black px-2 py-1"
          onClick={() => {
            navigate("/profile/");
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

      <div className="m-5 flex flex-col border p-5">
        {postsData.posts.map((post) => (
          <PostCardTest key={post._id} post={post} />
        ))}
      </div>

      {postsData.hasMorePosts ? (
        <button
          className="rounded-lg border border-black pl-1 pr-1"
          onClick={()=> {
            fetchPosts()
          }}
        >
          Load More
        </button>
      ):(<></>)}

    </div>
  );
};

export default Home;
