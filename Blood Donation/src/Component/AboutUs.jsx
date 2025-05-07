import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaTint, FaUserFriends } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <h2 className="heading-accent">About Us</h2>
            
            <div className="about-content">
                <p>
                    Welcome to the Blood Donation Platform! Our mission is to connect blood donors with those in need,
                    making the process of saving lives easier and more efficient. We believe in the power of community
                    and the importance of giving back.
                </p>
                
                <div className="about-values">
                    <div className="value-card">
                        <div className="value-icon">
                            <FaHeart />
                        </div>
                        <h3>Compassion</h3>
                        <p>We care deeply about every life that can be saved through blood donation.</p>
                    </div>
                    
                    <div className="value-card">
                        <div className="value-icon">
                            <FaTint />
                        </div>
                        <h3>Accessibility</h3>
                        <p>Making blood donation information accessible to everyone across the country.</p>
                    </div>
                    
                    <div className="value-card">
                        <div className="value-icon">
                            <FaUserFriends />
                        </div>
                        <h3>Community</h3>
                        <p>Building a strong network of donors, hospitals, and recipients for better coordination.</p>
                    </div>
                </div>
                
                <p>
                    Our platform provides information about blood donation eligibility, nearby hospitals, and FAQs to
                    help you understand the process better. Whether you're a first-time donor or a regular contributor,
                    we're here to support you every step of the way.
                </p>
                
                <p>
                    Together, we can make a difference and save lives. Thank you for being a part of this life-saving journey!
                </p>
            </div>
            
            <div className="contact-section">
                <h3 className="contact-heading">Contact Us</h3>
                <div className="contact-details">
                    <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <span>blooddonation@gmail.com</span>
                    </div>
                    <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        <span>+91 9876543210</span>
                    </div>
                    <div className="contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <span>123 Healthcare Avenue, Medical District, India</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;