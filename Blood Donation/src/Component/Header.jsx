import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./UserMenu";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { isAuthenticated, loading } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setActiveDropdown(null);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const isMobile = () => window.innerWidth <= 820;

    const handleDropdownClick = (index, event) => {
        if (isMobile()) {
            event.preventDefault();
            toggleDropdown(index);
        }
    };

    return (
        <header>
            <nav className="navbar">
                <div className="logo-container">
                    <img 
                        src="/blood-drop-svgrepo-com.svg" 
                        alt="Blood Donation Logo" 
                        className="logo"
                    />
                    <span className="logo-text" style={{ color: 'var(--primary-color)' }}>BloodDonation</span>
                </div>
                
                <button className="menu-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </NavLink>
                    <div className={`dropdown ${activeDropdown === 0 ? 'active' : ''}`}>
                        <span onClick={(e) => handleDropdownClick(0, e)}>Donate</span>
                        <div className="dropdown-content">
                            <NavLink to="/eligible" onClick={() => setIsMenuOpen(false)}>Eligibility</NavLink>
                            <NavLink to="/blood-camps" onClick={() => setIsMenuOpen(false)}>Camps</NavLink>
                            <NavLink to="/awareness" onClick={() => setIsMenuOpen(false)}>Awareness</NavLink>
                        </div>
                    </div>
                    <div className={`dropdown ${activeDropdown === 1 ? 'active' : ''}`}>
                        <span onClick={(e) => handleDropdownClick(1, e)}>Find Blood</span>
                        <div className="dropdown-content">
                            <NavLink to="/show-hospital" onClick={() => setIsMenuOpen(false)}>Blood Banks</NavLink>
                            <NavLink to="/find-donor" onClick={() => setIsMenuOpen(false)}>Find Donor</NavLink>
                            <NavLink to="/blood-types" onClick={() => setIsMenuOpen(false)}>Compatibility</NavLink>
                            <NavLink to="/blood-donation-guidelines" onClick={() => setIsMenuOpen(false)}>Guidelines</NavLink>
                        </div>
                    </div>
                    <div className={`dropdown ${activeDropdown === 2 ? 'active' : ''}`}>
                        <span onClick={(e) => handleDropdownClick(2, e)}>Learn</span>
                        <div className="dropdown-content">
                            <NavLink to="/awareness" onClick={() => setIsMenuOpen(false)}>Process</NavLink>
                            <NavLink to="/FAQ" onClick={() => setIsMenuOpen(false)}>FAQs</NavLink>
                        </div>
                    </div>
                    <div className={`dropdown ${activeDropdown === 3 ? 'active' : ''}`}>
                        <span onClick={(e) => handleDropdownClick(3, e)}>About</span>
                        <div className="dropdown-content">
                            <NavLink to="/aboutus" onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
                            <NavLink to="/mission" onClick={() => setIsMenuOpen(false)}>Mission</NavLink>
                            <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
                        </div>
                    </div>
                    <div className={`dropdown ${activeDropdown === 4 ? 'active' : ''}`}>
                        <span onClick={(e) => handleDropdownClick(4, e)}>Organization</span>
                        <div className="dropdown-content">
                            <NavLink to="/organization-register" onClick={() => setIsMenuOpen(false)}>Register</NavLink>
                            <NavLink to="/organization-login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                        </div>
                    </div>
                </div>
                
                {!loading && (
                    <div className="auth-section">
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <div className="auth-buttons">
                                <NavLink to="/login" className="login-btn"><FaSignInAlt /> Sign In</NavLink>
                                <NavLink to="/register" className="register-btn"><FaUserPlus /> Register</NavLink>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;