import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSearch } from "react-icons/fa";
import "../styles/BloodCamps.css";

const BloodCamps = () => {
  const [bloodCamps, setBloodCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch blood camps data on component mount
  useEffect(() => {
    const fetchBloodCamps = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/blood-camps');
        setBloodCamps(response.data);
        setFilteredCamps(response.data);
        
        // Extract unique states from camps data
        const uniqueStates = [...new Set(response.data
          .filter(camp => camp.hospital?.state)
          .map(camp => camp.hospital.state))];
        setStates(uniqueStates.sort());
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blood camps:', err);
        setError('Failed to load blood donation camps. Please try again later.');
        setLoading(false);
      }
    };

    fetchBloodCamps();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (selectedState) {
      const stateHospitals = bloodCamps.filter(camp => 
        camp.hospital?.state === selectedState
      );
      
      const uniqueDistricts = [...new Set(stateHospitals
        .filter(camp => camp.hospital?.district)
        .map(camp => camp.hospital.district))];
      
      setDistricts(uniqueDistricts.sort());
    } else {
      setDistricts([]);
    }
    
    setSelectedDistrict("");
  }, [selectedState, bloodCamps]);

  // Filter camps based on selected state, district, and search text
  useEffect(() => {
    let filtered = bloodCamps;
    
    if (selectedState) {
      filtered = filtered.filter(camp => camp.hospital?.state === selectedState);
    }
    
    if (selectedDistrict) {
      filtered = filtered.filter(camp => camp.hospital?.district === selectedDistrict);
    }
    
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(camp => 
        camp.title.toLowerCase().includes(searchLower) ||
        camp.venue.toLowerCase().includes(searchLower) ||
        camp.hospital?.name.toLowerCase().includes(searchLower) ||
        camp.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredCamps(filtered);
  }, [selectedState, selectedDistrict, searchText, bloodCamps]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedState("");
    setSelectedDistrict("");
    setSearchText("");
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="blood-camps-container">
      <div className="blood-camps-header">
        <h1>Blood Donation Camps</h1>
        <p>Find upcoming blood donation drives and camps near you. Join us in saving lives!</p>
      </div>

      <div className="search-and-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search camps by title, venue, or hospital..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        
        <button className="toggle-filters-btn" onClick={toggleFilters}>
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className={`filters-section ${showFilters ? 'show' : ''}`}>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="state">State</label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="district">District</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">All Districts</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="filter-summary">
        <p>
          {filteredCamps.length} {filteredCamps.length === 1 ? 'camp' : 'camps'} found
          {selectedState && ` in ${selectedState}`}
          {selectedDistrict && `, ${selectedDistrict}`}
          {searchText && ` matching "${searchText}"`}
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading camps...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="camps-grid">
          {filteredCamps.length > 0 ? (
            filteredCamps.map((camp) => (
              <div key={camp._id} className="camp-card">
                <div className="camp-header">
                  <h2>{camp.title}</h2>
                  <div className="camp-date">
                    <FaCalendarAlt />
                    <span>{formatDate(camp.date)}</span>
                  </div>
                </div>
                
                <div className="camp-info">
                  <div className="camp-organizer">
                    Organized by: <strong>{camp.hospital?.name || 'Unknown Hospital'}</strong>
                  </div>
                  
                  <div className="camp-time">
                    <span className="info-label">Time:</span> {camp.time}
                  </div>
                  
                  <div className="camp-venue">
                    <FaMapMarkerAlt />
                    <span>{camp.venue}</span>
                    {camp.hospital?.district && camp.hospital?.state && (
                      <span className="venue-location">
                        {camp.hospital.district}, {camp.hospital.state}
                      </span>
                    )}
                  </div>
                  
                  <div className="camp-description">
                    {camp.description}
                  </div>
                  
                  <div className="camp-contact">
                    <span className="info-label">Contact:</span> 
                    <span>{camp.contactPerson}, {camp.contactPhone}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-camps-message">
              <FaSearch size={32} />
              <h3>No blood camps found</h3>
              <p>
                {selectedState || selectedDistrict || searchText ? 
                  "Try changing your filters or search criteria." : 
                  "There are no upcoming blood donation camps at the moment."}
              </p>
              {(selectedState || selectedDistrict || searchText) && (
                <button className="reset-btn" onClick={resetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BloodCamps; 