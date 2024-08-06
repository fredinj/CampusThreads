import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authCheckUrl = "http://localhost:3000/api/auth/check-auth"
                const response = await axios.get(authCheckUrl, { withCredentials: true });
                setIsAuthenticated(response.data.authenticated);
                setUserRole(response.data.role); // Store the user role
            } catch (error) {
                setIsAuthenticated(false);
                setUserRole(null);
                console.log(error);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const loginUrl = "http://localhost:3000/api/auth/login";
            await axios.post(loginUrl, credentials, { withCredentials: true });
            setIsAuthenticated(true);
            const response = await axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true });
            setUserRole(response.data.role); // Store the user role
        } catch (error) {
            setIsAuthenticated(false);
            setUserRole(null);
            throw error; // Propagate the error to be handled in the component
        }
    };

    const logout = async () => {
        try {
            const logoutUrl = "http://localhost:3000/api/auth/logout";
            await axios.post(logoutUrl, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUserRole(null);
        } catch (error) {
            console.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
