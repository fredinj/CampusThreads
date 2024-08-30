import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import './UserProfile.css';

const UserProfile = () => {
  const { isAuthenticated, user, logout, checkAuth } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });
  const [editableUser, setEditableUser] = useState(user);
  const [hasChanges, setHasChanges] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const isVerificationScreen = location.search.includes('token');

  useEffect(() => {
    const getTokenFromParams = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        verifyEmail(token);
      }
    };

    getTokenFromParams();
  }, [location.search]); // Run when location.search changes

  const verifyEmail = async (token) => {
    setIsVerifying(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/auth/verify-email?token=${token}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setVerificationMessage('Email verified successfully.');
        alert('Email verified successfully.');
        await checkAuth(); // Update the user's authentication status
        navigate('/profile'); // Navigate to profile page
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationMessage('Email verification failed. Please try again.');
      alert('Email verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await axios.put(
        'http://localhost:3000/api/auth/send-verify-email',
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", 
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('Email verification link sent successfully');
        // Redirect to the verification screen
        navigate('/verify-email');
      }
    } catch (error) {
      console.error('Error sending email verification link:', error);
      alert('Error sending email verification link. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleInputChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      alert('No changes have been made');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:3000/api/user/update', 
        editableUser,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setHasChanges(false);
        setIsEditing({
          firstName: false,
          lastName: false,
          email: false,
        });
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  useEffect(() => {
    setEditableUser(user);
  }, [user]);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user/comments/${user._id}`);
        if (response.status === 200) {
          setUserComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching user comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    if (user && user._id) {
      fetchUserComments();
    }
  }, [user]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user/posts/${user._id}`);
        if (response.status === 200) {
          setUserPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (user && user._id) {
      fetchUserPosts();
    }
  }, [user]);

  if (!isAuthenticated && !isVerificationScreen) {
    return <div>Please log in to see your profile.</div>;
  }

  if (!user && !isVerifying) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      
      <div className="user-profile-container">
        <h1 className="user-profile-heading"><b>User Profile</b></h1>
        {isVerifying ? (
          <div>Verifying email...</div>
        ) : (
          <>
            {verificationMessage && <div className="email-verification-status" style={{ textAlign: 'center', backgroundColor: user.emailVerified ? 'green' : 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>{verificationMessage}</div>}
            {user && (
              <div className="user-profile-details">
                <div className="user-profile-detail">
                  <div className="user-profile-field">
                    <label className="user-profile-detail-label">First Name:</label>
                    {isEditing.firstName ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editableUser.firstName}
                        onChange={handleInputChange}
                        className="user-profile-input"
                      />
                    ) : (
                      <span>{editableUser.firstName}</span>
                    )}
                  </div>
                  <FaPencilAlt
                    className="user-profile-edit-icon"
                    onClick={() => handleEditToggle('firstName')}
                  />
                </div>
                <div className="user-profile-detail">
                  <div className="user-profile-field">
                    <label className="user-profile-detail-label">Last Name:</label>
                    {isEditing.lastName ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editableUser.lastName}
                        onChange={handleInputChange}
                        className="user-profile-input"
                      />
                    ) : (
                      <span>{editableUser.lastName}</span>
                    )}
                  </div>
                  <FaPencilAlt
                    className="user-profile-edit-icon"
                    onClick={() => handleEditToggle('lastName')}
                  />
                </div>
                <div className="user-profile-detail">
                  <div className="user-profile-field">
                    <label className="user-profile-detail-label">Email:</label>
                    {isEditing.email ? (
                      <input
                        type="email"
                        name="email"
                        value={editableUser.email}
                        onChange={handleInputChange}
                        className="user-profile-input"
                      />
                    ) : (
                      <span>{editableUser.email}</span>
                    )}
                  </div>
                  <FaPencilAlt
                    className="user-profile-edit-icon"
                    onClick={() => handleEditToggle('email')}
                  />
                </div>
                <button className="user-profile-save-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            )}
            {user && !isVerificationScreen && (
              <>
                <div className="email-verification-status" style={{ textAlign: 'center', marginTop: '10px' }}>
                  {user.emailVerified ? (
                    <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>Email verified</div>
                  ) : (
                    <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>Email not verified</div>
                  )}
                </div>
                {!user.emailVerified && (
                  <button 
                    className="user-profile-verify-email-button"
                    onClick={handleVerifyEmail}
                    style={{ 
                      display: 'block', 
                      margin: '20px auto', 
                      padding: '10px 20px', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Send verification email
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {!isVerificationScreen && (
        <div className="user-comments-section" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '24px' }}>Your Comments</h2>
          {loadingComments ? (
            <p>Loading comments...</p>
          ) : userComments.length > 0 ? (
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {userComments.map((comment) => (
                <Link to={`/post/${comment.post}`} key={comment._id}>
                  <li style={{ marginBottom: '16px' }}>
                    <Typography
                      variant="body2"
                      component="div"
                      dangerouslySetInnerHTML={{ __html: comment.comment_content }}
                      sx={{ mb: 2, lineHeight: 1.6, color: 'text.secondary' }}
                    />
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p>You have not made any comments yet.</p>
          )}

<div className="user-posts-section" style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '24px' }}>Your Posts</h2>
      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : userPosts.length > 0 ? (
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          {userPosts.map((post) => (
            <Link to={`/post/${post._id}`} key={post._id}>
              <li style={{ marginBottom: '16px' }}>
                <Typography
                  variant="body2"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: post.post_title }}
                  sx={{ mb: 2, lineHeight: 1.6, color: 'text.secondary' }}
                />
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>You have not made any posts yet.</p>
      )}
    </div>

        </div>
      )}
    </div>
  );
};

export default UserProfile;