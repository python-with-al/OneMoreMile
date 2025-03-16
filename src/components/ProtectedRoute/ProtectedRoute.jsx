import React from 'react';
import {Navigate} from 'react-router-dom';

// Protected route component to check for authentication
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };
  export default ProtectedRoute;