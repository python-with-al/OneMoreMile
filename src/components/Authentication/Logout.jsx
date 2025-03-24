// components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Important for cookies
      });

      if (response.ok) {
        // Clear local user data
        localStorage.removeItem('user');
        
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
        <button className="btn-primary" onClick={handleLogout}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <img src="src/assets/icons/logout.svg" alt="logout icon" style={{ height: '25px' }} />
                <span style={{ fontSize: '10px' }}>Logout</span>
            </div>
        </button>

  );
};

export default LogoutButton;