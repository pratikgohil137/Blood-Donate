import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarCheck, FaSearch, FaHospital } from 'react-icons/fa';
import '../styles/FeatureCards.css';

const FeatureCards = () => {
  const features = [
    {
      icon: <FaHospital />,
      title: 'Blood Banks',
      description: 'Find blood banks and donation centers near you',
      linkTo: '/show-hospital',
      color: '#e91e63'
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Blood Camps',
      description: 'Find upcoming blood donation drives and awareness campaigns',
      linkTo: '/blood-camps',
      color: '#d32f2f'
    },
    {
      icon: <FaSearch />,
      title: 'Find Donors',
      description: 'Search for blood donors by blood types and location',
      linkTo: '/find-donor',
      color: '#c2185b'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Eligibility',
      description: 'Check if you are eligible to donate blood',
      linkTo: '/eligible',
      color: '#880e4f'
    }
  ];

  return (
    <div className="feature-cards-section">
      <div className="feature-cards-container">
        {features.map((feature, index) => (
          <Link to={feature.linkTo} key={index} className="feature-card">
            <div className="feature-card-content">
              <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-cta">
                Learn More <span className="arrow">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards; 