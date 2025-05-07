import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaTint, FaCalendarCheck, FaEdit, FaCamera, FaTrash, FaCheck } from 'react-icons/fa';
import Footer from './Footer';
import '../UserProfile.css';
import axios from 'axios';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    bloodGroup: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
  const [donorStatus, setDonorStatus] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sample donation history data
  const [donationHistory, setDonationHistory] = useState([
    { 
      id: 1, 
      date: '2023-12-15', 
      location: 'Red Cross Blood Bank, Chennai', 
      bloodGroup: 'O+', 
      units: 1,
      status: 'Completed'
    },
    { 
      id: 2, 
      date: '2023-08-02', 
      location: 'Apollo Hospitals, Chennai', 
      bloodGroup: 'O+', 
      units: 1,
      status: 'Completed'
    },
  ]);

  // Sample upcoming appointments
  const appointments = [
    {
      id: 1,
      date: '2024-08-15',
      time: '10:30 AM',
      location: 'Red Cross Blood Bank, Chennai',
      status: 'Scheduled'
    }
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        bloodGroup: user.bloodGroup || '',
        age: user.age || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
      
      // Check if user is a donor
      checkDonorStatus();
    }
  }, [user]);

  // Check if the user is registered as a donor
  const checkDonorStatus = async () => {
    try {
      // First try to get from API
      if (user && user.email) {
        try {
          const response = await axios.get('http://localhost:3000/donors', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          // Find donor by email
          const donor = response.data.find(d => d.email === user.email || d.contact === user.mobile);
          
          if (donor) {
            setDonorStatus(donor);
            return;
          }
        } catch (error) {
          console.error('Error checking donor status from API:', error);
        }
      }
      
      // Fallback to localStorage
      try {
        const donorRegistration = localStorage.getItem('donor_registration');
        if (donorRegistration) {
          const donorData = JSON.parse(donorRegistration);
          if (donorData.email === user?.email || donorData.phone === user?.mobile) {
            setDonorStatus(donorData);
          }
        } else {
          // Check in donors array
          const donors = JSON.parse(localStorage.getItem('donors') || '[]');
          const donor = donors.find(d => 
            d.email === user?.email || d.phone === user?.mobile || d.fullName === user?.name
          );
          
          if (donor) {
            setDonorStatus(donor);
          }
        }
      } catch (error) {
        console.error('Error checking donor status from localStorage:', error);
      }
    } catch (error) {
      console.error('Error checking donor status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateStatus({ type: 'loading', message: 'Updating profile...' });
      
      // Remove empty string values and email field (which can't be changed)
      const dataToSend = {};
      Object.keys(profileData).forEach(key => {
        if (profileData[key] && key !== 'email') {
          dataToSend[key] = profileData[key];
        }
      });
      
      console.log('Sending profile data:', dataToSend);
      
      const response = await axios.patch('http://localhost:3000/user/profile', dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        // Update the user in context
        if (updateUser) {
          updateUser(response.data.user);
        }
        
        setIsEditing(false);
        setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
        
        // Clear status message after 3 seconds
        setTimeout(() => {
          setUpdateStatus({ type: '', message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.log('Error response:', error.response?.data);
      
      setUpdateStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to update profile. Please try again.' 
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original user data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        bloodGroup: user.bloodGroup || '',
        age: user.age || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
    setIsEditing(false);
  };

  // Function to delete donor record
  const handleDeleteDonorRecord = async () => {
    setIsDeleting(true);
    
    try {
      // Confirm deletion
      const confirmDelete = window.confirm(
        "Are you sure you want to remove yourself as a blood donor? This action cannot be undone."
      );
      
      if (!confirmDelete) {
        setIsDeleting(false);
        return;
      }
      
      // First, try to delete from server
      let deletedFromServer = false;
      
      if (donorStatus && donorStatus._id) {
        try {
          const response = await axios.delete(`http://localhost:3000/donors/${donorStatus._id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.data.status === 'success') {
            deletedFromServer = true;
          }
        } catch (error) {
          console.error('Error deleting donor record from server:', error);
          // Continue with localStorage deletion
        }
      }
      
      // Handle localStorage deletion
      try {
        // 1. Remove from donor_registration
        localStorage.removeItem('donor_registration');
        
        // 2. Remove from donors array
        const donors = JSON.parse(localStorage.getItem('donors') || '[]');
        
        // Filter out the current user
        const updatedDonors = donors.filter(donor => {
          if (user && (
            (donor.email && donor.email === user.email) ||
            (donor.phone && donor.phone === user.mobile) ||
            (donor.fullName && donor.fullName === user.name)
          )) {
            return false; // Remove this donor
          }
          return true; // Keep other donors
        });
        
        localStorage.setItem('donors', JSON.stringify(updatedDonors));
      } catch (error) {
        console.error('Error removing donor record from localStorage:', error);
      }
      
      // Show success message
      setUpdateStatus({
        type: 'success',
        message: 'Your donor record has been successfully removed.'
      });
      
      // Reset donor status
      setDonorStatus(null);
      
      // Clear status message after a few seconds
      setTimeout(() => {
        setUpdateStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting donor record:', error);
      setUpdateStatus({
        type: 'error',
        message: 'Failed to remove donor record. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Add donation record
  const handleAddDonation = () => {
    // Prompt user for donation details
    const location = prompt("Enter the donation location (hospital/blood bank name):");
    if (!location) return;
    
    const date = prompt("Enter donation date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!date) return;
    
    // Create new donation record
    const newDonation = {
      id: Date.now(),
      date,
      location,
      bloodGroup: user?.bloodGroup || profileData.bloodGroup || "Unknown",
      units: 1,
      status: 'Completed'
    };
    
    // Add to donation history
    setDonationHistory(prev => [newDonation, ...prev]);
    
    // Update donor status to reflect this donation
    if (donorStatus) {
      const updatedDonorStatus = {
        ...donorStatus,
        lastDonation: date
      };
      setDonorStatus(updatedDonorStatus);
      
      // Update in localStorage if needed
      try {
        localStorage.setItem('donor_registration', JSON.stringify(updatedDonorStatus));
      } catch (error) {
        console.error('Error updating donor registration in localStorage:', error);
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" />
            ) : (
              <FaUser />
            )}
            <div className="avatar-overlay">
              <FaCamera />
            </div>
          </div>
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email || ''}</p>
          
          {donorStatus && (
            <div className="donor-badge">
              <FaTint /> Registered Blood Donor
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FaUser /> Personal Information
          </button>
          <button 
            className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <FaTint /> Donation History
          </button>
          <button 
            className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <FaCalendarCheck /> Appointments
          </button>
        </div>

        <div className="profile-tab-content">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="personal-info-tab">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!isEditing ? (
                  <button className="edit-button" onClick={() => setIsEditing(true)}>
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-button" onClick={handleSaveProfile}>
                      Save
                    </button>
                    <button className="cancel-button" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {updateStatus.message && (
                <div className={`status-message ${updateStatus.type}`}>
                  {updateStatus.message}
                </div>
              )}

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profileData.email} 
                      onChange={handleInputChange} 
                      disabled={true} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      value={profileData.mobile} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select 
                      name="bloodGroup" 
                      value={profileData.bloodGroup} 
                      onChange={handleInputChange} 
                      disabled={!isEditing}
                    >
                      <option value="">Select Blood Group</option>
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
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input 
                      type="number" 
                      name="age" 
                      value={profileData.age} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select 
                      name="gender" 
                      value={profileData.gender} 
                      onChange={handleInputChange} 
                      disabled={!isEditing}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={profileData.address} 
                    onChange={handleInputChange} 
                    disabled={!isEditing} 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={profileData.city} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={profileData.state} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={profileData.pincode} 
                      onChange={handleInputChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                </div>

                {/* Donor status section */}
                {donorStatus && (
                  <div className="donor-status-section">
                    <div className="section-header">
                      <h3>Donor Status</h3>
                      <button 
                        className="delete-button" 
                        onClick={handleDeleteDonorRecord}
                        disabled={isDeleting}
                      >
                        <FaTrash /> {isDeleting ? 'Removing...' : 'Remove Donor Status'}
                      </button>
                    </div>
                    <div className="donor-info">
                      <p><strong>Status:</strong> Active Donor</p>
                      <p><strong>Blood Type:</strong> {donorStatus.bloodType || donorStatus.bloodGroup || user?.bloodGroup || 'Not specified'}</p>
                      <p><strong>Last Donation:</strong> {donorStatus.lastDonation ? new Date(donorStatus.lastDonation).toLocaleDateString() : 'No donations recorded'}</p>
                      <p className="donor-note">
                        <FaCheck /> After donating blood, you can remove yourself from the donor list if you wish. 
                        This will delete your record from our donor database.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="donations-tab">
              <div className="section-header">
                <h3>Blood Donation History</h3>
                {donorStatus && (
                  <button className="add-button" onClick={handleAddDonation}>
                    Add Donation
                  </button>
                )}
              </div>
              
              {donationHistory.length === 0 ? (
                <div className="no-data-message">
                  <p>No donation history found. Once you donate blood, your records will appear here.</p>
                </div>
              ) : (
                <div className="donation-history">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Blood Group</th>
                        <th>Units</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donationHistory.map(donation => (
                        <tr key={donation.id}>
                          <td>{new Date(donation.date).toLocaleDateString()}</td>
                          <td>{donation.location}</td>
                          <td>{donation.bloodGroup}</td>
                          <td>{donation.units}</td>
                          <td>
                            <span className={`status ${donation.status.toLowerCase()}`}>
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {donorStatus && donationHistory.length > 0 && (
                <div className="donation-actions">
                  <button 
                    className="delete-button" 
                    onClick={handleDeleteDonorRecord}
                    disabled={isDeleting}
                  >
                    <FaTrash /> {isDeleting ? 'Processing...' : 'Remove Donor Status After Donation'}
                  </button>
                  <p className="action-note">
                    If you've recently donated blood and wish to be removed from the active donors list,
                    you can remove your donor status. Your donation history will be preserved.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="appointments-tab">
              <div className="section-header">
                <h3>Upcoming Appointments</h3>
                <button className="primary-button">Schedule New</button>
              </div>

              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map(appointment => (
                    <div className="appointment-card" key={appointment.id}>
                      <div className="appointment-date">
                        <div className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="day">{new Date(appointment.date).getDate()}</div>
                        <div className="year">{new Date(appointment.date).getFullYear()}</div>
                      </div>
                      <div className="appointment-details">
                        <h4>Blood Donation Appointment</h4>
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Location:</strong> {appointment.location}</p>
                        <p><strong>Status:</strong> <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span></p>
                      </div>
                      <div className="appointment-actions">
                        <button className="reschedule-button">Reschedule</button>
                        <button className="cancel-appointment">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You don't have any upcoming appointments.</p>
                  <button className="primary-button">Schedule Now</button>
                </div>
              )}

              <div className="appointment-tips">
                <h4>Preparation Tips</h4>
                <ul>
                  <li>Get plenty of sleep the night before your donation.</li>
                  <li>Eat a healthy meal before your appointment.</li>
                  <li>Drink an extra 16 oz of water before your appointment.</li>
                  <li>Bring a valid ID to your appointment.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 