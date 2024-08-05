import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
          setIsLoading(true);
            try {
                const authCheckUrl = "http://localhost:3000/api/auth/check-auth"
                const response = await axios.get(authCheckUrl, { withCredentials: true });
                setIsAuthenticated(response.data.authenticated);
                // console.log("auth context works yay")
                // console.log("authenticated", response.data.authenticated)
            } catch (error) {
                setIsAuthenticated(false);
                console.log(error)
                // console.log("auth context not works nooo")
                // console.log("authenticated", response.data.authenticated)
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
        } catch (error) {
            console.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
