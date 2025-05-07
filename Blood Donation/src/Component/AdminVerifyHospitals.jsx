import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminVerifyHospitals.css';

const AdminVerifyHospitals = () => {
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [currentHospital, setCurrentHospital] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPendingVerifications = async () => {
      try {
        setLoading(true);
        
        // Fetch hospitals with pending verification
        const response = await axios.get('http://localhost:3000/admin/pending-verification', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPendingVerifications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch verification requests. Please try again later.');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }
      }
    };

    fetchPendingVerifications();
  }, [navigate]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };
  
  const handleApprove = async (hospital) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `http://localhost:3000/admin/verify-hospital/${hospital._id}`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from pending list
      setPendingVerifications(prevState => 
        prevState.filter(h => h._id !== hospital._id)
      );
      
      showNotification('Hospital verification approved successfully!', 'success');
    } catch (err) {
      showNotification('Failed to approve hospital verification. Please try again.', 'error');
    }
  };
  
  const openRejectModal = (hospital) => {
    setCurrentHospital(hospital);
    setRejectReason('');
    setShowRejectModal(true);
  };
  
  const handleReject = async () => {
    if (!currentHospital) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `http://localhost:3000/admin/verify-hospital/${currentHospital._id}`,
        { 
          status: 'rejected',
          message: rejectReason 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from pending list
      setPendingVerifications(prevState => 
        prevState.filter(h => h._id !== currentHospital._id)
      );
      
      setShowRejectModal(false);
      showNotification('Hospital verification rejected', 'success');
    } catch (err) {
      showNotification('Failed to reject hospital verification. Please try again.', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-verify-hospitals">
      <div className="admin-header">
        <h1>Verify Hospital Organizations</h1>
        <div className="admin-actions">
          <button 
            className="dashboard-btn"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="verification-requests">
        <h2>Pending Verification Requests</h2>
        
        {pendingVerifications.length === 0 ? (
          <p className="no-records">No pending verification requests at the moment.</p>
        ) : (
          pendingVerifications.map(hospital => (
            <div key={hospital._id} className="verification-card">
              <div className="hospital-info">
                <h3>{hospital.name}</h3>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span>{hospital.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span>{hospital.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span>{hospital.address}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">District:</span>
                  <span>{hospital.district}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">State:</span>
                  <span>{hospital.state}</span>
                </div>
              </div>
              
              <div className="verification-details">
                <h4>Verification Details</h4>
                <div className="info-row">
                  <span className="info-label">License Number:</span>
                  <span>{hospital.verificationDetails?.licenseNumber || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Registration Number:</span>
                  <span>{hospital.verificationDetails?.registrationNumber || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Submitted On:</span>
                  <span>{formatDate(hospital.verificationDetails?.submittedAt)}</span>
                </div>
                
                {hospital.verificationDetails?.documentUrls && (
                  <div className="document-links">
                    <h5>Verification Documents</h5>
                    <ul>
                      {hospital.verificationDetails.documentUrls.map((url, index) => (
                        <li key={index}>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            Document {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="verification-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(hospital)}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => openRejectModal(hospital)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Reject Verification</h3>
            <p>Please provide a reason for rejecting {currentHospital?.name}'s verification:</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection"
              rows={4}
            />
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifyHospitals; 