import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import PostCard from '../../components/post/PostCard';
import Navbar from '../../components/navbar/Navbar';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import TagSidebar from '../../components/SideBar/SideBarComponent';
import RightBarComponent from '../../components/SideBar/RightBarComponent';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ScrollableContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
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

const PostsByTag = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/posts/tag/?tag=${tag}`); 
        const fetchedPosts = response.data.posts || [];
        if (fetchedPosts.length === 0) {
          // Redirect to home page if no posts found
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
        setPosts(fetchedPosts);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tag, navigate]);

  return (
    <div className="w-full min-h-full">
      <div className="flex">
        {/* TagSidebar */}
        <TagSidebar />

        {/* Main content */}
        <div className="flex-grow p-5 h-[calc(100vh-80px)] flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full">
              <LoadingIndicator />
            </div>
          ) : error ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="error">Error: {error}</Typography>
            </Box>
          ) : (
            <ScrollableContainer>
              <div className="w-full max-w-[50rem] mx-auto flex flex-col items-center">
                {/* Posts container */}
                <div className="flex flex-col items-center w-full">
                  {posts.map((post) => (
                    <PostCard key={post._id} postProp={post} />
                  ))}
                </div>
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

export default PostsByTag;
