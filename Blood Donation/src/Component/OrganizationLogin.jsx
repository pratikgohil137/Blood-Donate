import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const OrganizationLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:3000/organization-login', { 
        email, 
        password
      });
      
      setMessage(response.data.message);
      localStorage.setItem('orgToken', response.data.token);
      localStorage.setItem('orgInfo', JSON.stringify(response.data.hospital));
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/hospital-dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <img
            src="/blood-drop-svgrepo-com.svg"
            alt="Blood Donation"
            className="auth-logo"
            style={{ width: '50px', height: '50px', marginBottom: '15px' }}
          />
          <h2>Organization Login</h2>
          <p>Access your hospital dashboard</p>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/organization-register">Register here</a>
          </p>
          <p>
            <a href="/login">User Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLogin;