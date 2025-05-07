import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaUserCircle, FaCog } from 'react-icons/fa';
import '../UserMenu.css';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div className="user-menu-trigger" onClick={toggleMenu}>
        {user?.profileImage ? (
          <img src={user.profileImage} alt="Profile" className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">
            <FaUserCircle />
          </div>
        )}
        <span className="user-name">{firstName}</span>
      </div>

      {isOpen && (
        <div className="user-dropdown-menu">
          <div className="user-info">
            <div className="user-info-header">
              <div className="user-avatar-large">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <FaUserCircle />
                )}
              </div>
              <div className="user-details">
                <h4>{user?.name || 'User'}</h4>
                <p>{user?.email || ''}</p>
              </div>
            </div>
          </div>

          <div className="menu-items">
            <NavLink to="/profile" className="menu-item" onClick={() => setIsOpen(false)}>
              <FaUser /> My Profile
            </NavLink>
            <NavLink to="/settings" className="menu-item" onClick={() => setIsOpen(false)}>
              <FaCog /> Settings
            </NavLink>
            <div className="menu-divider"></div>
            <button className="menu-item logout-button" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 