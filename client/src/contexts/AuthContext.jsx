import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
          setIsLoading(true);
            try {
                const authCheckUrl = "http://localhost:3000/api/auth/check-auth"
                const response = await axios.get(authCheckUrl, { withCredentials: true });
                setIsAuthenticated(response.data.authenticated);
                setUser(response.data.user); // Store the user data

            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                console.log(error)

            } finally {
              setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const loginUrl = "http://localhost:3000/api/auth/login";
            await axios.post(loginUrl, credentials, { withCredentials: true });
            const response = await axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true });
            setUser(response.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            setIsAuthenticated(false);
            throw error; // Propagate the error to be handled in the component
        }
    };

    const logout = async () => {
        try {
            const logoutUrl = "http://localhost:3000/api/auth/logout";
            await axios.post(logoutUrl, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user }}>
            {children}
        </AuthContext.Provider>
    );
};
