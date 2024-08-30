import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
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

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getTokenFromParams = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        verifyEmail(token);
      }
    };

    getTokenFromParams();
  }, []); // Run only once on component mount

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

  if (!isAuthenticated && !location.search.includes('token')) {
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
            {verificationMessage && <div>{verificationMessage}</div>}
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
            {user && (
              <>
                <p>{user.emailVerified ? "Email verified" : "Email not verified"}</p>
                {!user.emailVerified && (
                  <button onClick={handleVerifyEmail}>
                    Send verification email
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;