import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminSetup.css';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to access this page');
      return;
    }

    // Fetch user info
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
        setUserId(response.data._id); // Automatically set user ID
      } catch (err) {
        setError('Failed to fetch user information');
        console.error(err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // For this example, we'll use a simple secret key verification
      const response = await axios.post('http://localhost:3000/make-admin', { 
        userId, 
        secretKey 
      });
      
      setMessage('Admin privileges granted successfully! You can now access the admin dashboard.');
      
      // Redirect to admin dashboard after short delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set admin privileges');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="admin-setup-container">
        <div className="admin-setup-card">
          <h2>Admin Setup</h2>
          {error && <div className="error-message">{error}</div>}
          <p>Please log in to set up admin access.</p>
          <button 
            className="login-redirect-btn"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h2>Admin Setup</h2>
        <p className="setup-info">
          Enter the admin secret key to grant admin privileges to your account.
          <br />
          <span className="important-note">Important: The default secret key is "Admin@123"</span>
        </p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-setup-form">
          <div className="form-group">
            <label htmlFor="userId">User ID (Your account)</label>
            <input
              type="text"
              id="userId"
              value={userId}
              readOnly
              className="readonly-input"
            />
            <small>This is automatically set to your user ID</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="secretKey">Admin Secret Key</label>
            <input
              type="password"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              placeholder="Enter the admin secret key"
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : 'Set Admin Privileges'}
          </button>
        </form>
        
        <div className="back-link">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
            Back to previous page
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup; 