import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;