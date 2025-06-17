import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PrivateRoute = () => {
  const token = localStorage.getItem('access_token');
  
  
  console.log('PrivateRoute - Checking authentication...');
  console.log('Token exists:', !!token);

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const isTokenValid = decoded.exp > currentTime;
    
    console.log('Token expiration:', new Date(decoded.exp * 1000));
    console.log('Current time:', new Date(currentTime * 1000));
    console.log('Token valid:', isTokenValid);

    if (!isTokenValid) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      console.log('Token expired, redirecting to login');
      return <Navigate to="/login" replace />;
    }

   
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authentication successful, rendering protected content');
    
    return <Outlet />;
  } catch (err) {
    console.error('Token decoding error:', err);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;