import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

function PrivateRoute({ children, role }) {
    const user = AuthService.getCurrentUser();
    if (!AuthService.isAuthenticated() || (role && user.role !== role)) {
        return <Navigate to="/" />;
    }
    return children;
}

export default PrivateRoute;
