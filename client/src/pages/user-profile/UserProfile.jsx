// src/pages/UserProfile.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const UserProfile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileUrl = "http://localhost:3000/api/users/me"; // Assuming this is your endpoint to fetch user data
        const response = await axios.get(profileUrl, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.log("Failed to fetch user data", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Please log in to see your profile.</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;
