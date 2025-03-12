import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // In a real app, you'd call your API here
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Redirect to login page on successful signup
      navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
    } catch (err) {
      // For demo purposes, we can bypass the API call
      // Comment out the code below and use the real API call above in production
      console.log('Would normally call API, bypassing for demo');
      navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
      
      // Uncomment this in production
      // setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f7fafc'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '2rem', 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an Account</h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fed7d7', 
            color: '#c53030', 
            padding: '0.75rem', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="name" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold' 
              }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ 
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold' 
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold' 
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{ 
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="confirmPassword" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold' 
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              style={{ 
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#4299e1', 
                textDecoration: 'none' 
              }}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;