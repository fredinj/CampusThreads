// src/pages/UserProfile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const [editableUser, setEditableUser] = useState(user);
  const [hasChanges, setHasChanges] = useState(false);

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleInputChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    setHasChanges(true); // Set hasChanges to true when any field is edited
  };

  const handleSave = async () => {
    if (!hasChanges) {
      alert('No Changes have been made'); // Show alert if no changes have been made
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
          withCredentials: true, // This ensures cookies are sent with the request
        }
      ); // Replace with your API endpoint

      if (response.status === 200) {
        setHasChanges(false); // Reset changes flag after successful save
        setIsEditing({
          firstName: false,
          lastName: false,
          email: false,
        }); // Make all fields non-editable
        alert('Profile updated successfully');
        console.log('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    setEditableUser(user);
  }, [user]);

  if (!isAuthenticated) {
    return <div>Please log in to see your profile.</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <nav className='flex flex-col items-center justify-center'>
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
          navigate(`/categories`);
        }}
      >
        Categories
      </button>
      <button
        className="ml-2 rounded border border-black px-2 py-1"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
      <div className="user-profile-container">
        <h1 className="user-profile-heading"><b>User Profile</b></h1>
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
      </div>
      </nav>
  );
};

export default UserProfile;
