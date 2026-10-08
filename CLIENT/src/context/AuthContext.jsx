
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from './useAuth';

const decodeJwt = (token) => {
    try {
        const payload = token.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(normalized));
    } catch {
        return null;
    }
};

const isTokenExpired = (token) => {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(() => {
        const token = localStorage.getItem('token');
        return !!token && !isTokenExpired(token);
    });

    const login = (token, userId) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setIsLogin(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLogin(false);
    };

    useEffect(() => {
        const handleExpired = () => {
            if (!localStorage.getItem('token')) return;
            logout();
            toast.error('Session expired. Please login again.');
            navigate('/login', {
                replace: true,
                state: {
                    message: 'Session expired. Please login again.',
                    from: location.pathname,
                },
            });
        };

        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            handleExpired();
        }

        window.addEventListener('auth:expired', handleExpired);
        return () => window.removeEventListener('auth:expired', handleExpired);
    }, [navigate, location.pathname]);

    return (
        <AuthContext.Provider value={{ isLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
