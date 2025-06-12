import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const PrivateRoute = () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    
    try {
        const decoded = jwtDecode(token);  
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return <Navigate to="/login" replace />;
        }
    } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return <Navigate to="/login" replace />;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return <Outlet />;
};

export default PrivateRoute;