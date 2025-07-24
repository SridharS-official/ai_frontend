import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ensure you have run: npm install jwt-decode

export const AuthContext = createContext(null);

// Helper function to get user data from the token in local storage
const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedUser = jwtDecode(token);
            // Check if token is expired
            if (decodedUser.exp * 1000 > Date.now()) {
                return { ...decodedUser, token };
            }
        } catch (e) {
            console.error("Invalid token:", e);
        }
    }
    // If no token, token is invalid, or token is expired, clear storage
    localStorage.removeItem('token');
    return null;
};

export const AuthProvider = ({ children }) => {
    // Initialize the user state synchronously
    const [user, setUser] = useState(getUserFromToken());

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setUser({ ...userData, token: newToken });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};