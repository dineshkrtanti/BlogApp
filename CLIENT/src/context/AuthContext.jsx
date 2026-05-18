
import React from 'react'
import { useState } from 'react';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem('userId'));

    const login = (token, userId) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setIsLogin(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLogin(false);
    };

    return (
        <AuthContext.Provider value={{ isLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
