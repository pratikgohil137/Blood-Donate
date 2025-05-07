import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Auth.css";
import { FaTint } from 'react-icons/fa';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-section">
          <div className="auth-header">
            {/* <img
              src="/src/assets/Blood-Donation Logo.png"
              alt="Blood Donation"
              className="auth-logo"
            /> */}
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
          </div>

          {message && <div className="success-alert">{message}</div>}
          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button">Send Reset Link</button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{" "}
              <span onClick={() => navigate("/login")} className="login-link">
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-content">
          <div className="auth-features">
            <div className="auth-feature-card">
              <div className="feature-icon">
                <FaTint />
              </div>
              <h3>Save Lives</h3>
              <p>Your donation can save up to three lives. Join thousands of donors and make a difference today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;