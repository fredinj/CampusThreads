import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PostCard from "../../components/post/PostCard";
import Navbar from '../../components/navbar/Navbar';
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import TagSidebar from "../../components/SideBar/SideBarComponent"; // Import the TagSidebar component
import RightBarComponent from "../../components/SideBar/RightBarComponent"; // Import the RightBarComponent
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ScrollableContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto', // Enables vertical scrolling
  scrollbarWidth: 'thin', /* For Firefox */
  scrollbarColor: 'transparent transparent', /* For Firefox */
  '&::-webkit-scrollbar': {
    width: '8px',
    backgroundColor: 'transparent', // Hide the scrollbar background
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent', // Hide the scrollbar thumb
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#b0b0b0', // Show thumb color on hover
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
});

const Home = () => {
  const [postsData, setPostsData] = useState({
    posts: [],
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
      const response = await axios.get(`/api/posts/home?postSkip=${fetchedPostsCount}&postLimit=3&userId=${user._id}`, {
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

  useEffect(() => {
    if (postsData.posts) {
      setFetchedPostsCount(postsData.posts.length);
      setTotalPostsCount(postsData.posts.totalPosts);
    }
  }, [postsData]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full min-h-full">
      {/* <Navbar /> */}
      <div className="flex">
        <TagSidebar />

        {/* Main content */}
        <div className="flex-grow p-5 h-[calc(100vh-80px)] flex flex-col">
          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center w-full">
              <LoadingIndicator />
            </div>
          ) : (
            <ScrollableContainer>
              <div className="w-full max-w-[50rem] mx-auto flex flex-col items-center">
                {/* Posts container */}
                <div className="flex flex-col items-center w-full">
                  {postsData.posts.map((post) => (
                    <PostCard key={post._id} postProp={post} />
                  ))}
                </div>

                {/* Load More button */}
                {postsData.hasMorePosts && (
                  <button
                    className="mt-4 rounded-lg border border-white px-3 py-1 text-white"
                    onClick={fetchPosts}
                  >
                    Load More
                  </button>
                )}
              </div>
            </ScrollableContainer>
          )}
        </div>

        {/* RightBarComponent */}
        <RightBarComponent />
      </div>
    </div>
  );
};

export default Home;
