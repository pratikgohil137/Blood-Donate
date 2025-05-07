import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestStatusUpdate, setRequestStatusUpdate] = useState({ status: '', notes: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    // Check for token in multiple possible storage locations
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    if (!token) {
      console.log('No admin token found, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Token found, attempting admin verification');
    
    // First verify that the user is actually an admin
    const verifyAdmin = async () => {
      try {
        // First try to fetch dashboard data directly
        // If we're not an admin, the server will reject it with 401/403
        fetchDashboardData(token);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        navigate('/login');
      }
    };
    
    const fetchDashboardData = async (authToken) => {
      try {
        setLoading(true);
        
        // Fetch pending hospitals
        const pendingResponse = await axios.get('http://localhost:3000/admin/pending-hospitals', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Pending hospitals response:', pendingResponse.data);
        setPendingHospitals(pendingResponse.data);
        
        // Fetch all hospitals to filter out approved ones
        const allHospitalsResponse = await axios.get('http://localhost:3000/hospitals', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const approved = allHospitalsResponse.data.filter(
          hospital => hospital.approvalStatus === 'approved'
        );
        setApprovedHospitals(approved);
        
        // Get count of unverified hospitals
        try {
          const unverifiedResponse = await axios.get('http://localhost:3000/admin/unverified-hospitals', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          setUnverifiedCount(unverifiedResponse.data.length);
        } catch (error) {
          console.error("Error fetching unverified count:", error);
          setUnverifiedCount(0);
        }
        
        // Fetch blood requests if on that tab
        if (activeTab === 'requests') {
          await fetchBloodRequests(authToken);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    verifyAdmin();
  }, [navigate, activeTab]);
  
  const fetchBloodRequests = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/admin/blood-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBloodRequests(response.data);
    } catch (error) {
      console.error('Error fetching blood requests:', error);
    }
  };

  const handleApproval = async (hospitalId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `http://localhost:3000/admin/hospital-approval/${hospitalId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the list after approval/rejection
      setPendingHospitals(prevState => 
        prevState.filter(hospital => hospital._id !== hospitalId)
      );
      
      // If approved, add to approved list
      if (status === 'approved') {
        const approvedHospital = pendingHospitals.find(h => h._id === hospitalId);
        if (approvedHospital) {
          approvedHospital.approvalStatus = 'approved';
          approvedHospital.approvalDate = new Date();
          approvedHospital.verified = true;
          setApprovedHospitals(prev => [...prev, approvedHospital]);
        }
      }
      
      // Show notification
      setNotification({
        message: `Hospital ${status === 'approved' ? 'approved' : 'rejected'} successfully!`,
        type: 'success'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      
    } catch (err) {
      setNotification({
        message: `Failed to ${status} hospital. Please try again.`,
        type: 'error'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
    }
  };
  
  const openStatusModal = (request) => {
    setSelectedRequest(request);
    setRequestStatusUpdate({ 
      status: request.status, 
      notes: request.notes || '' 
    });
    setShowStatusModal(true);
  };
  
  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRequest) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `http://localhost:3000/admin/blood-requests/${selectedRequest._id}`,
        requestStatusUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the local state
      setBloodRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, ...requestStatusUpdate } 
            : req
        )
      );
      
      // Close modal
      setShowStatusModal(false);
      setSelectedRequest(null);
      
      // Show notification
      setNotification({
        message: `Blood request status updated to ${requestStatusUpdate.status}`,
        type: 'success'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      
    } catch (err) {
      setNotification({
        message: 'Failed to update blood request status. Please try again.',
        type: 'error'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
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
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button 
            className="verify-btn"
            onClick={() => navigate('/admin/verify-hospitals')}
          >
            Verify Hospitals {unverifiedCount > 0 && `(${unverifiedCount})`}
          </button>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('token');
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
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals ({pendingHospitals.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Organizations ({approvedHospitals.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('requests');
            const token = localStorage.getItem('adminToken');
            if (token) fetchBloodRequests(token);
          }}
        >
          Blood Requests
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'pending' && (
          <div className="pending-hospitals">
            <h2>Pending Hospital Approvals</h2>
            
            {pendingHospitals.length === 0 ? (
              <p className="no-records">No pending approvals at the moment.</p>
            ) : (
              pendingHospitals.map(hospital => (
                <div key={hospital._id} className="hospital-card">
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
                    {hospital.description && (
                      <div className="info-row">
                        <span className="info-label">Description:</span>
                        <span>{hospital.description}</span>
                      </div>
                    )}
                    {hospital.services && hospital.services.length > 0 && (
                      <div className="info-row">
                        <span className="info-label">Services:</span>
                        <span>{hospital.services.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApproval(hospital._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleApproval(hospital._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'approved' && (
          <div className="approved-hospitals">
            <h2>Approved Organizations</h2>
            
            {approvedHospitals.length === 0 ? (
              <p className="no-records">No approved organizations yet.</p>
            ) : (
              approvedHospitals.map(hospital => (
                <div key={hospital._id} className="hospital-card approved">
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
                    {hospital.approvalDate && (
                      <div className="info-row">
                        <span className="info-label">Approved On:</span>
                        <span>{new Date(hospital.approvalDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'requests' && (
          <div className="blood-requests">
            <h2>Blood Donation Requests</h2>
            
            {bloodRequests.length === 0 ? (
              <p className="no-records">No blood donation requests at the moment.</p>
            ) : (
              <div className="requests-list">
                {bloodRequests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="request-header">
                      <div className="blood-type">{request.bloodType}</div>
                      <div className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="request-hospital">
                      <span className="hospital-name">{request.hospital?.name || 'Unknown Hospital'}</span>
                    </div>
                    
                    <div className="request-details">
                      <div className="detail-row">
                        <span className="detail-label">Patient:</span>
                        <span>{request.patientName}</span>
                        {request.patientAge && (
                          <span className="age">({request.patientAge} yrs)</span>
                        )}
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Units Required:</span>
                        <span>{request.units}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Urgency:</span>
                        <span className={request.urgency === 'urgent' ? 'urgent-tag' : ''}>
                          {request.urgency === 'urgent' ? 'URGENT' : 'Standard'}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Purpose:</span>
                        <span>{request.purpose}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Request Date:</span>
                        <span>{formatDate(request.requestDate)}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Contact:</span>
                        <span>{request.contactPerson}, {request.contactPhone}</span>
                      </div>
                      
                      {request.notes && (
                        <div className="detail-row">
                          <span className="detail-label">Notes:</span>
                          <span>{request.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="request-actions">
                      <button 
                        className="update-status-btn"
                        onClick={() => openStatusModal(request)}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Status Update Modal */}
      {showStatusModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="status-modal" onClick={e => e.stopPropagation()}>
            <h3>Update Blood Request Status</h3>
            
            <div className="request-summary">
              <p><strong>Hospital:</strong> {selectedRequest.hospital?.name}</p>
              <p><strong>Blood Type:</strong> {selectedRequest.bloodType}</p>
              <p><strong>Units:</strong> {selectedRequest.units}</p>
              <p><strong>Patient:</strong> {selectedRequest.patientName}</p>
            </div>
            
            <form onSubmit={handleStatusUpdateSubmit}>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={requestStatusUpdate.status}
                  onChange={(e) => setRequestStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={requestStatusUpdate.notes}
                  onChange={(e) => setRequestStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add notes about this status update"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 