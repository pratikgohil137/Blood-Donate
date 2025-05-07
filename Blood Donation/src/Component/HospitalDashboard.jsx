import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HospitalDashboard.css';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    district: '',
    state: '',
    description: '',
    services: []
  });
  const [editMode, setEditMode] = useState(false);
  const [profileEdits, setProfileEdits] = useState({});
  const [bloodCamps, setBloodCamps] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // New blood camp form state
  const [newCamp, setNewCamp] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    contactPerson: '',
    contactPhone: ''
  });
  
  // New blood request form state
  const [newRequest, setNewRequest] = useState({
    bloodType: '',
    units: '',
    urgency: 'standard',
    patientName: '',
    patientAge: '',
    patientGender: '',
    purpose: '',
    contactPerson: '',
    contactPhone: '',
    notes: ''
  });
  
  // Check if user is logged in as a hospital
  useEffect(() => {
    const token = localStorage.getItem('orgToken');
    if (!token) {
      navigate('/organization-login');
      return;
    }
    
    // Fetch hospital profile
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/hospital/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('orgToken');
          navigate('/organization-login');
        } else {
          setNotification({
            message: 'Failed to load profile. Please try again.',
            type: 'error'
          });
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  }, [navigate]);
  
  // Fetch blood camps when tab changes to camps
  useEffect(() => {
    if (activeTab === 'camps') {
      fetchBloodCamps();
    } else if (activeTab === 'requests') {
      fetchBloodRequests();
    }
  }, [activeTab]);
  
  const fetchBloodCamps = async () => {
    try {
      const token = localStorage.getItem('orgToken');
      const response = await axios.get('http://localhost:3000/hospital/blood-camps', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBloodCamps(response.data);
    } catch (err) {
      setNotification({
        message: 'Failed to load blood camps. Please try again.',
        type: 'error'
      });
    }
  };
  
  const fetchBloodRequests = async () => {
    try {
      const token = localStorage.getItem('orgToken');
      const response = await axios.get('http://localhost:3000/hospital/blood-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBloodRequests(response.data);
    } catch (err) {
      setNotification({
        message: 'Failed to load blood requests. Please try again.',
        type: 'error'
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('orgToken');
    navigate('/organization-login');
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProfileEdits(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit mode
      setProfileEdits({});
    } else {
      // Enter edit mode with current values
      setProfileEdits({
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        description: profile.description || '',
        services: profile.services?.join(', ') || ''
      });
    }
    setEditMode(!editMode);
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('orgToken');
      
      // Process services from comma-separated string to array
      let updatedProfileData = { ...profileEdits };
      if (profileEdits.services) {
        updatedProfileData.services = profileEdits.services
          .split(',')
          .map(service => service.trim())
          .filter(service => service !== '');
      }
      
      const response = await axios.patch(
        'http://localhost:3000/hospital/profile',
        updatedProfileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile(response.data);
      setEditMode(false);
      setNotification({
        message: 'Profile updated successfully!',
        type: 'success'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      
    } catch (err) {
      setNotification({
        message: 'Failed to update profile. Please try again.',
        type: 'error'
      });
    }
  };
  
  const handleCampChange = (e) => {
    const { name, value } = e.target;
    setNewCamp(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCampSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('orgToken');
      
      const response = await axios.post(
        'http://localhost:3000/blood-camps',
        newCamp,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotification({
        message: 'Blood camp posted successfully!',
        type: 'success'
      });
      
      // Reset form
      setNewCamp({
        title: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        contactPerson: '',
        contactPhone: ''
      });
      
      // Switch to camps tab
      setActiveTab('camps');
      
      // Fetch updated camps
      fetchBloodCamps();
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || 'Failed to post blood camp. Please try again.',
        type: 'error'
      });
    }
  };
  
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('orgToken');
      
      const response = await axios.post(
        'http://localhost:3000/blood-requests',
        newRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotification({
        message: 'Blood request submitted successfully!',
        type: 'success'
      });
      
      // Reset form
      setNewRequest({
        bloodType: '',
        units: '',
        urgency: 'standard',
        patientName: '',
        patientAge: '',
        patientGender: '',
        purpose: '',
        contactPerson: '',
        contactPhone: '',
        notes: ''
      });
      
      // Switch to requests tab
      setActiveTab('requests');
      
      // Fetch updated requests
      fetchBloodRequests();
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || 'Failed to submit blood request. Please try again.',
        type: 'error'
      });
    }
  };
  
  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'fulfilled':
        return 'status-fulfilled';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="hospital-loading">Loading...</div>;
  }
  
  return (
    <div className="hospital-dashboard">
      <div className="dashboard-header">
        <h1>Hospital Dashboard</h1>
        <div className="hospital-name">{profile.name}</div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      {/* Verification Banner */}
      {profile && !profile.verified && (
        <div className="verification-banner">
          <div className="verification-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>
              Your hospital account is not fully verified. Please complete the verification process 
              to be listed publicly and access all features.
            </span>
          </div>
          <a href="/hospital-verification" className="verification-btn">
            Complete Verification
          </a>
        </div>
      )}
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'camps' ? 'active' : ''}`}
          onClick={() => setActiveTab('camps')}
        >
          Blood Camps
        </button>
        <button 
          className={`tab-btn ${activeTab === 'newcamp' ? 'active' : ''}`}
          onClick={() => setActiveTab('newcamp')}
        >
          Post New Camp
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Blood Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'newrequest' ? 'active' : ''}`}
          onClick={() => setActiveTab('newrequest')}
        >
          New Blood Request
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Hospital Profile</h2>
              <button 
                className={`edit-btn ${editMode ? 'cancel' : ''}`}
                onClick={handleEditToggle}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {editMode ? (
              <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                <div className="form-group">
                  <label htmlFor="name">Hospital Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileEdits.name || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={profileEdits.address || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Contact Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profileEdits.phone || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={profileEdits.description || ''}
                    onChange={handleEditChange}
                    rows="4"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="services">Services (comma-separated)</label>
                  <input
                    type="text"
                    id="services"
                    name="services"
                    value={profileEdits.services || ''}
                    onChange={handleEditChange}
                    placeholder="Blood Donation, Platelet Donation, etc."
                  />
                </div>
                
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Hospital Name:</span>
                  <span className="info-value">{profile.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{profile.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">District:</span>
                  <span className="info-value">{profile.district}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">State:</span>
                  <span className="info-value">{profile.state}</span>
                </div>
                {profile.description && (
                  <div className="info-item">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{profile.description}</span>
                  </div>
                )}
                {profile.services && profile.services.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">Services:</span>
                    <span className="info-value">{profile.services.join(', ')}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Verification Status:</span>
                  <span className={`info-value status-badge ${profile.verified ? 'verified' : 'unverified'}`}>
                    {profile.verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Approval Status:</span>
                  <span className={`info-value status-badge ${profile.approvalStatus}`}>
                    {profile.approvalStatus}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'camps' && (
          <div className="camps-section">
            <div className="section-header">
              <h2>Blood Camps</h2>
              <button 
                className="new-btn"
                onClick={() => setActiveTab('newcamp')}
              >
                Post New Camp
              </button>
            </div>
            
            {bloodCamps.length === 0 ? (
              <div className="no-data-message">
                <p>You haven't posted any blood camps yet.</p>
                <button 
                  className="new-btn"
                  onClick={() => setActiveTab('newcamp')}
                >
                  Post Your First Camp
                </button>
              </div>
            ) : (
              <div className="camps-list">
                {bloodCamps.map(camp => (
                  <div key={camp._id} className="camp-card">
                    <div className="camp-header">
                      <h3>{camp.title}</h3>
                      <div className="camp-date">
                        {new Date(camp.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="camp-details">
                      <div className="camp-info">
                        <span className="info-label">Time:</span>
                        <span>{camp.time}</span>
                      </div>
                      <div className="camp-info">
                        <span className="info-label">Venue:</span>
                        <span>{camp.venue}</span>
                      </div>
                      <div className="camp-info">
                        <span className="info-label">Description:</span>
                        <span>{camp.description}</span>
                      </div>
                      <div className="camp-info">
                        <span className="info-label">Contact Person:</span>
                        <span>{camp.contactPerson}</span>
                      </div>
                      <div className="camp-info">
                        <span className="info-label">Contact Phone:</span>
                        <span>{camp.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'newcamp' && (
          <div className="new-camp-section">
            <h2>Post a New Blood Camp</h2>
            
            <form onSubmit={handleCampSubmit} className="new-camp-form">
              <div className="form-group">
                <label htmlFor="title">Camp Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCamp.title}
                  onChange={handleCampChange}
                  required
                  placeholder="Enter camp title"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newCamp.date}
                    onChange={handleCampChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={newCamp.time}
                    onChange={handleCampChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="venue">Venue *</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={newCamp.venue}
                  onChange={handleCampChange}
                  required
                  placeholder="Enter camp venue/location"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCamp.description}
                  onChange={handleCampChange}
                  required
                  placeholder="Enter camp description"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={newCamp.contactPerson}
                    onChange={handleCampChange}
                    required
                    placeholder="Name of contact person"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone *</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={newCamp.contactPhone}
                    onChange={handleCampChange}
                    required
                    placeholder="Phone number for inquiries"
                  />
                </div>
              </div>
              
              <button type="submit" className="submit-camp-btn">
                Post Blood Camp
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'requests' && (
          <div className="requests-section">
            <div className="section-header">
              <h2>Blood Donation Requests</h2>
              <button 
                className="new-btn"
                onClick={() => setActiveTab('newrequest')}
              >
                New Request
              </button>
            </div>
            
            {bloodRequests.length === 0 ? (
              <div className="no-data-message">
                <p>You haven't made any blood donation requests yet.</p>
                <button 
                  className="new-btn"
                  onClick={() => setActiveTab('newrequest')}
                >
                  Make Your First Request
                </button>
              </div>
            ) : (
              <div className="requests-list">
                {bloodRequests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="request-header">
                      <div className="request-blood-type">{request.bloodType}</div>
                      <div className={`request-status ${getStatusBadgeClass(request.status)}`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="request-details">
                      <div className="request-info">
                        <span className="info-label">Patient:</span>
                        <span>{request.patientName}</span>
                      </div>
                      
                      <div className="request-info">
                        <span className="info-label">Units Required:</span>
                        <span>{request.units}</span>
                      </div>
                      
                      <div className="request-info">
                        <span className="info-label">Urgency:</span>
                        <span className={request.urgency === 'urgent' ? 'urgent-text' : ''}>
                          {request.urgency === 'urgent' ? 'URGENT' : 'Standard'}
                        </span>
                      </div>
                      
                      <div className="request-info">
                        <span className="info-label">Purpose:</span>
                        <span>{request.purpose}</span>
                      </div>
                      
                      <div className="request-info">
                        <span className="info-label">Request Date:</span>
                        <span>{formatDate(request.requestDate)}</span>
                      </div>
                      
                      <div className="request-info">
                        <span className="info-label">Contact:</span>
                        <span>{request.contactPerson}, {request.contactPhone}</span>
                      </div>
                      
                      {request.notes && (
                        <div className="request-info">
                          <span className="info-label">Notes:</span>
                          <span>{request.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'newrequest' && (
          <div className="new-request-section">
            <h2>Submit Blood Donation Request</h2>
            
            <form onSubmit={handleRequestSubmit} className="new-request-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type Required *</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={newRequest.bloodType}
                    onChange={handleRequestChange}
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="units">Units Required *</label>
                  <input
                    type="number"
                    id="units"
                    name="units"
                    value={newRequest.units}
                    onChange={handleRequestChange}
                    min="1"
                    required
                    placeholder="Number of units"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="urgency">Urgency Level *</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={newRequest.urgency}
                  onChange={handleRequestChange}
                  required
                >
                  <option value="standard">Standard</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="patientName">Patient Name *</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={newRequest.patientName}
                  onChange={handleRequestChange}
                  required
                  placeholder="Patient's full name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientAge">Patient Age</label>
                  <input
                    type="number"
                    id="patientAge"
                    name="patientAge"
                    value={newRequest.patientAge}
                    onChange={handleRequestChange}
                    placeholder="Patient's age"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="patientGender">Patient Gender</label>
                  <select
                    id="patientGender"
                    name="patientGender"
                    value={newRequest.patientGender}
                    onChange={handleRequestChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="purpose">Purpose *</label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={newRequest.purpose}
                  onChange={handleRequestChange}
                  required
                  placeholder="Purpose for blood requirement"
                  rows="2"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={newRequest.contactPerson}
                    onChange={handleRequestChange}
                    required
                    placeholder="Name of contact person"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone *</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={newRequest.contactPhone}
                    onChange={handleRequestChange}
                    required
                    placeholder="Phone number for contact"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newRequest.notes}
                  onChange={handleRequestChange}
                  placeholder="Any additional information or special requirements"
                  rows="2"
                />
              </div>
              
              <button type="submit" className="submit-request-btn">
                Submit Blood Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard; 