import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/OrganizationRegister.css';

const OrganizationRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
    district: '',
    state: '',
    description: '',
    services: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Convert services string to array
      const servicesArray = formData.services
        .split(',')
        .map(service => service.trim())
        .filter(service => service !== '');

      // Create payload without confirmPassword
      const payload = {
        ...formData,
        services: servicesArray
      };
      delete payload.confirmPassword;

      const response = await axios.post('http://localhost:3000/organization-register', payload);
      
      setMessage(response.data.message);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
        district: '',
        state: '',
        description: '',
        services: ''
      });
      
      // Redirect to success page or login after short delay
      setTimeout(() => {
        navigate('/organization-login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="org-register-container">
      <div className="org-register-card">
        <h2>Hospital/Organization Registration</h2>
        <p className="form-subtitle">Register your hospital/blood bank to be featured on our platform</p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="org-register-form">
          <div className="form-group">
            <label htmlFor="name">Organization Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter hospital/organization name"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Contact Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Create a password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Full Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter complete address"
              rows="2"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district">District *</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                placeholder="Enter district"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Enter state"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Organization Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your organization"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="services">Services Offered</label>
            <input
              type="text"
              id="services"
              name="services"
              value={formData.services}
              onChange={handleChange}
              placeholder="Services separated by commas (e.g., Blood Donation, Platelet Donation)"
            />
          </div>
          
          <div className="form-note">
            <p>
              Note: Your registration will be reviewed by our administrators 
              before being approved. You will receive an email notification 
              once your registration is approved, after which you can log in.
            </p>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Register Organization'}
          </button>
        </form>
        
        <div className="login-link">
          <p>Already registered? <a href="/organization-login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister; 