import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isLogin } = useAuth();
    const location = useLocation();

    if (!isLogin) {
        // Pass the message AND where they were trying to go
        return (
            <Navigate
                to="/login"
                state={{ message: "Please login first!", from: location.pathname }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;