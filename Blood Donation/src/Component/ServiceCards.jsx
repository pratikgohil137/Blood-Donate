import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTint, FaHeart, FaCalendarCheck, FaArrowRight, FaUserFriends } from 'react-icons/fa';

const ServiceCards = () => {
    return (
        <div className="service-cards">
            <div className="service-section-header">
                <h2 className="heading-accent">Our Services</h2>
                <p className="service-description">Discover how we help connect donors with those in need through our comprehensive services</p>
            </div>
            
            <div className="service-cards-container">
                <div className="service-card">
                    <div className="service-card-icon location">
                        <FaMapMarkerAlt />
                    </div>
                    <div className="service-card-content">
                        <h3>Find Blood Bank</h3>
                        <p>Locate nearest donation centers and blood banks in your area</p>
                        <span className="service-link">
                            <FaArrowRight />
                        </span>
                    </div>
                    <div className="card-overlay"></div>
                    <Link to="/show-hospital" className="card-link" aria-label="Find blood banks"></Link>
                </div>
                
                <div className="service-card">
                    <div className="service-card-icon request">
                        <FaUserFriends />
                    </div>
                    <div className="service-card-content">
                        <h3>Find Donor</h3>
                        <p>Search for available donors by location and blood type</p>
                        <span className="service-link">
                            <FaArrowRight />
                        </span>
                    </div>
                    <div className="card-overlay"></div>
                    <Link to="/find-donor" className="card-link" aria-label="Find blood donors"></Link>
                </div>
                
                <div className="service-card">
                    <div className="service-card-icon types">
                        <FaHeart />
                    </div>
                    <div className="service-card-content">
                        <h3>Blood Types</h3>
                        <p>Learn about blood types and check donor-recipient compatibility</p>
                        <span className="service-link">
                            <FaArrowRight />
                        </span>
                    </div>
                    <div className="card-overlay"></div>
                    <Link to="/blood-types" className="card-link" aria-label="Blood types information"></Link>
                </div>
                
                <div className="service-card">
                    <div className="service-card-icon camps">
                        <FaCalendarCheck />
                    </div>
                    <div className="service-card-content">
                        <h3>Blood Camps</h3>
                        <p>Find upcoming blood donation drives and awareness campaigns</p>
                        <span className="service-link">
                            <FaArrowRight />
                        </span>
                    </div>
                    <div className="card-overlay"></div>
                    <Link to="/blood-camps" className="card-link" aria-label="Blood donation camps"></Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCards; 