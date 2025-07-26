import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedUser = jwtDecode(token);
            if (decodedUser.exp * 1000 > Date.now()) {
                return { ...decodedUser, token };
            }
        } catch (e) {
            console.error("Invalid token:", e);
        }
    }
    localStorage.removeItem('token');
    return null;
};

export const AuthProvider = ({ children }) => {
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