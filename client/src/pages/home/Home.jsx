import React, { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PostCard from "../../components/post/PostCard";
import Navbar from '../../components/navbar/Navbar'
import LoadingIndicator from "../../components/ui/LoadingIndicator";

const Home = () => {
  const [postsData, setPostsData] = useState({
    posts:[],
    hasMorePosts: false
  });
  const [loadingPosts, setLoadingPosts] = useState(true);
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
      const response = await axios.get(`http://localhost:3000/api/posts/home?postSkip=${fetchedPostsCount}&postLimit=3&userId=${user._id}`, {
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
      setLoadingPosts(false);
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

  if (error) return <p>Error: {error}</p>;

  return(
    <div className="w-full min-h-full">
      {/* <Navbar />   */}
  
      { loadingPosts ? ( <div className="flex flex-col items-center justify-center w-full"><LoadingIndicator /> </div>) : (

      <div className="flex flex-col items-center w-full">
        {/* Parent container with fixed width and centered content */}

        <div className="w-[50rem] mx-auto flex flex-col items-center mt-10">
          {/* Posts container */}

          <div className="flex flex-col items-center w-full">
            {postsData.posts.map((post) => (
              <PostCard key={post._id} postProp={post} />
            ))}
          </div>
  
          {/* Load More button */}
          {postsData.hasMorePosts ? (
            <button
              className="mt-4 rounded-lg border border-black px-3 py-1"
              onClick={() => {
                fetchPosts();
              }}
            >
              Load More
            </button>
          ) : null}
        </div>
      </div>
      )}
    </div>
  );
  
};

export default Home;
