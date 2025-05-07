import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HospitalVerification.css';

const HospitalVerification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licenseNumber: '',
    registrationNumber: '',
    documentUrls: ['']
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitalInfo, setHospitalInfo] = useState(null);

  useEffect(() => {
    // Check if user is logged in as hospital
    const token = localStorage.getItem('orgToken');
    if (!token) {
      navigate('/organization-login');
      return;
    }

    // Get hospital info from localStorage
    const storedInfo = localStorage.getItem('orgInfo');
    if (storedInfo) {
      try {
        setHospitalInfo(JSON.parse(storedInfo));
      } catch (e) {
        console.error('Error parsing hospital info:', e);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentChange = (e, index) => {
    const updatedUrls = [...formData.documentUrls];
    updatedUrls[index] = e.target.value;
    setFormData(prev => ({
      ...prev,
      documentUrls: updatedUrls
    }));
  };

  const addDocumentField = () => {
    setFormData(prev => ({
      ...prev,
      documentUrls: [...prev.documentUrls, '']
    }));
  };

  const removeDocumentField = (index) => {
    const updatedUrls = [...formData.documentUrls];
    updatedUrls.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      documentUrls: updatedUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate form
    if (!formData.licenseNumber || !formData.registrationNumber) {
      setError('License number and registration number are required');
      setLoading(false);
      return;
    }

    // Filter out empty document URLs
    const filteredUrls = formData.documentUrls.filter(url => url.trim() !== '');
    if (filteredUrls.length === 0) {
      setError('At least one document URL is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('orgToken');
      const response = await axios.post(
        'http://localhost:3000/organization-submit-verification',
        {
          licenseNumber: formData.licenseNumber,
          registrationNumber: formData.registrationNumber,
          documentUrls: filteredUrls
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage(response.data.message);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/hospital-dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit verification details');
    } finally {
      setLoading(false);
    }
  };

  if (!hospitalInfo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="hospital-verification-container">
      <div className="verification-card">
        <h2>Hospital Verification</h2>
        <p className="subtitle">Submit your verification details to complete your registration</p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="hospital-info">
          <h3>{hospitalInfo.name}</h3>
          <p><strong>Email:</strong> {hospitalInfo.email}</p>
          <p><strong>Address:</strong> {hospitalInfo.address}</p>
          <p><strong>District:</strong> {hospitalInfo.district}, <strong>State:</strong> {hospitalInfo.state}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="verification-form">
          <div className="form-group">
            <label htmlFor="licenseNumber">Hospital License Number*</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              placeholder="Enter hospital license number"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="registrationNumber">Registration Number*</label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              placeholder="Enter hospital registration number"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Document URLs*</label>
            <p className="help-text">
              Provide URLs to your license and registration documents stored on Google Drive, Dropbox, or any other cloud storage
            </p>
            
            {formData.documentUrls.map((url, index) => (
              <div key={index} className="document-input">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleDocumentChange(e, index)}
                  placeholder={`Document URL ${index + 1}`}
                  disabled={loading}
                  required
                />
                {formData.documentUrls.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeDocumentField(index)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-document-btn"
              onClick={addDocumentField}
              disabled={loading}
            >
              + Add Another Document
            </button>
          </div>
          
          <div className="form-note">
            <p>
              Note: Your verification will be reviewed by our administrators. 
              You will receive an email notification once your verification is processed.
            </p>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalVerification; 