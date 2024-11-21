import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [postNavbarDetails, setPostNavbarDetails] = useState({id:null, name:null})

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const authCheckUrl = "/api/auth/check-auth";
      const response = await axios.get(authCheckUrl, {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.authenticated);
      setUser(response.data.user); // Store the user data
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const reloadUserData = async() => {
    await checkAuth();
  }

  const login = async (credentials) => {
    setIsLoading(true); 
    try {
      const loginUrl = "/api/auth/login";
      await axios.post(loginUrl, credentials, { withCredentials: true });
      const response = await axios.get(
        "/api/auth/check-auth",
        { withCredentials: true },
      );
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error; // Propagate the error to be handled in the component
    } finally {
      setIsLoading(false); 
    }
  };

  const logout = async () => {
    setIsLoading(true); 
    try {
      const logoutUrl = "/api/auth/logout";
      await axios.post(logoutUrl, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading, user, reloadUserData, checkAuth, setPostNavbarDetails, postNavbarDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
};