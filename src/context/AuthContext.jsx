import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // On initial load, try to set user from existing token
        const tokenInStorage = localStorage.getItem('token');
        if (tokenInStorage) {
            try {
                const decodedUser = jwtDecode(tokenInStorage);
                setUser(decodedUser);
            } catch (e) {
                console.log('e: ', e);
                // Invalid token, clear it
                localStorage.removeItem('token');
                setToken(null);
            }
        }
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};