import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import { Typography, Chip, Avatar, CircularProgress, Box } from '@mui/material';
import { Person, Comment, Article } from '@mui/icons-material';
import { styled } from '@mui/system';

const ScrollableContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'transparent transparent',
  '&::-webkit-scrollbar': {
    width: '8px',
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#b0b0b0',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
});

const OtherProfile = () => {
  const [user, setUser] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await axios.get(`/api/user/comments/${userId}`);
        if (response.status === 200) {
          setUserComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching user comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchUserComments();
  }, [userId]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`/api/user/posts/${userId}`);
        if (response.status === 200) {
          setUserPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto px-4 py-8 overflow-hidden">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4" component="h1" className="font-bold">
            User Profile
          </Typography>
          <Chip
            label={user.role}
            color="primary"
            variant="outlined"
            icon={<Person />}
          />
        </div>
        <div className="flex items-center">
          <Avatar
            src={user.profilePicture || '/default-avatar.png'}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-24 h-24 mr-6"
          />
          <div>
            <Typography variant="h5" component="h2" className="font-semibold mb-2">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-2">
              {user.bio || 'No bio available'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex flex-1 space-x-8 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <Typography variant="h5" component="h2" className="font-bold mb-4 flex items-center">
            <Comment className="mr-2" /> User's Comments
          </Typography>
          <Box className="flex-1 overflow-auto pr-4">
            {loadingComments ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : userComments.length > 0 ? (
              <ul className="space-y-4">
                {userComments.map((comment) => (
                  <li key={comment._id} className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                    <Link to={`/post/${comment.post}`} className="text-blue-600 hover:underline">
                      <Typography
                        variant="body2"
                        component="div"
                        dangerouslySetInnerHTML={{ __html: comment.comment_content }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1">This user has not made any comments yet.</Typography>
            )}
          </Box>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <Typography variant="h5" component="h2" className="font-bold mb-4 flex items-center">
            <Article className="mr-2" /> User's Posts
          </Typography>
          <Box className="flex-1 overflow-auto pr-4">
            {loadingPosts ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : userPosts.length > 0 ? (
              <ul className="space-y-4">
                {userPosts.map((post) => (
                  <li key={post._id} className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                    <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline">
                      <Typography
                        variant="body2"
                        component="div"
                        dangerouslySetInnerHTML={{ __html: post.post_title }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1">This user has not made any posts yet.</Typography>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default OtherProfile;