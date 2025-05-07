import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLock, FaBell, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';
import '../AccountSettings.css';

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    donationReminders: true,
    eligibilityUpdates: true,
    marketingEmails: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      // Submit password change to backend
      // For now, we'll just log the data
      console.log('Password change submitted:', passwordData);
      
      // Reset form after successful submission
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success message (would be handled by a toast or alert in a real app)
      alert('Password changed successfully!');
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleSaveNotifications = () => {
    // Save notification preferences to backend
    console.log('Notification settings saved:', notificationSettings);
    alert('Notification preferences saved!');
  };

  const handleDeleteConfirmationChange = (e) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      // Call API to delete account
      console.log('Account deletion requested');
      // Logout user after account deletion
      logout();
      // Redirect would happen automatically due to auth state change
    } else {
      alert('Please type DELETE to confirm account deletion');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FaLock /> Password
          </button>
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell /> Notifications
          </button>
          <button 
            className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <FaUserShield /> Account
          </button>
        </div>

        <div className="settings-tab-content">
          {activeTab === 'password' && (
            <div className="password-tab">
              <h3>Change Password</h3>
              <p className="tab-description">Update your password to keep your account secure</p>
              
              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.currentPassword ? 'error' : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <div className="error-text">{passwordErrors.currentPassword}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? 'error' : ''}
                  />
                  {passwordErrors.newPassword && (
                    <div className="error-text">{passwordErrors.newPassword}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? 'error' : ''}
                  />
                  {passwordErrors.confirmPassword && (
                    <div className="error-text">{passwordErrors.confirmPassword}</div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-button">Update Password</button>
                </div>
              </form>

              <div className="password-tips">
                <h4>Password Tips</h4>
                <ul>
                  <li>Use at least 8 characters</li>
                  <li>Include a mix of letters, numbers, and symbols</li>
                  <li>Avoid using easily guessable information</li>
                  <li>Don't reuse passwords from other sites</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-tab">
              <h3>Notification Preferences</h3>
              <p className="tab-description">Control how you receive notifications and updates</p>
              
              <div className="notifications-section">
                <h4>Email Notifications</h4>
                <div className="notification-option">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="emailNotifications" 
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="notification-text">
                    <h5>Email Notifications</h5>
                    <p>Receive updates and confirmations via email</p>
                  </div>
                </div>

                <h4>SMS Notifications</h4>
                <div className="notification-option">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="smsNotifications" 
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="notification-text">
                    <h5>SMS Notifications</h5>
                    <p>Receive updates and reminders via text message</p>
                  </div>
                </div>

                <h4>Types of Notifications</h4>
                <div className="notification-option">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="donationReminders" 
                      checked={notificationSettings.donationReminders}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="notification-text">
                    <h5>Donation Reminders</h5>
                    <p>Get reminders when you're eligible to donate again</p>
                  </div>
                </div>

                <div className="notification-option">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="eligibilityUpdates" 
                      checked={notificationSettings.eligibilityUpdates}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="notification-text">
                    <h5>Eligibility Updates</h5>
                    <p>Updates about blood donation criteria and eligibility</p>
                  </div>
                </div>

                <div className="notification-option">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="marketingEmails" 
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="notification-text">
                    <h5>Marketing Emails</h5>
                    <p>Promotional content and newsletters</p>
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={handleSaveNotifications} className="primary-button">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="account-tab">
              <h3>Account Management</h3>
              <p className="tab-description">Manage your account settings and privacy</p>
              
              <div className="account-email">
                <h4>Account Email</h4>
                <p>{user?.email || 'Not available'}</p>
                <button className="secondary-button">Change Email</button>
              </div>

              <div className="data-export">
                <h4>Export Your Data</h4>
                <p>Download a copy of your personal data and donation history</p>
                <button className="secondary-button">Request Data Export</button>
              </div>

              <div className="danger-zone">
                <h4><FaExclamationTriangle /> Danger Zone</h4>
                
                {!showDeleteConfirm ? (
                  <div>
                    <p>Permanently delete your account and all associated data</p>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)} 
                      className="danger-button"
                    >
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="delete-confirmation">
                    <p>This action cannot be undone. All your personal data and donation history will be permanently removed.</p>
                    <p>Please type <strong>DELETE</strong> to confirm:</p>
                    <input 
                      type="text" 
                      value={deleteConfirmation} 
                      onChange={handleDeleteConfirmationChange} 
                      className="delete-confirm-input"
                    />
                    <div className="delete-actions">
                      <button 
                        onClick={handleDeleteAccount} 
                        className="danger-button"
                        disabled={deleteConfirmation !== 'DELETE'}
                      >
                        Permanently Delete Account
                      </button>
                      <button 
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmation('');
                        }} 
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 