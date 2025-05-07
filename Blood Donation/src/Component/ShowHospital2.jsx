import React, { useEffect, useState } from "react";
import HospitalData from "../assets/HospitalData.json"; // Import JSON file
import { IoLocationSharp, IoNavigate } from "react-icons/io5";
import { FaMapMarkerAlt, FaSearch, FaInfoCircle, FaExternalLinkAlt, FaHeart, FaHeartbeat, FaHandHoldingHeart, FaHospital } from "react-icons/fa";
import { reverseGeocodeWithGoogle, reverseGeocode, findNearestMatch } from "../utils/geoUtils";
import { GOOGLE_MAPS_API_KEY } from "../config";
import "../ShowHospital.css"; // Make sure you have this CSS file
import axios from "axios";
import { Link } from "react-router-dom";

const ShowHospital2 = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Controls how many hospitals to show
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bloodCamps, setBloodCamps] = useState([]);
  const [showCamps, setShowCamps] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  
  // Load hospital data and set states
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/hospitals');
        
        // Filter to only show approved hospitals
        const approvedHospitals = response.data.filter(hospital => 
          hospital.approvalStatus === 'approved'
        );
        
        // Extract all unique states from hospitals
        const uniqueStates = [...new Set(approvedHospitals.map(hospital => hospital.state))].sort();
        setStates(uniqueStates);
        
        setHospitals(approvedHospitals);
        setFilteredHospitals(approvedHospitals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError('Failed to load hospitals. Please try again later.');
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (selectedState) {
      const filteredDistricts = [...new Set(hospitals
        .filter(hospital => hospital.state === selectedState)
        .map(hospital => hospital.district)
      )];
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
    
    // Only reset district selection if it's not being set programmatically during location detection
    if (!isLocating) {
      setSelectedDistrict(""); 
    }
  }, [selectedState, hospitals, isLocating]);

  // Filter hospitals dynamically
  useEffect(() => {
    let filtered = hospitals;
    if (selectedState) {
      filtered = filtered.filter(hospital => hospital.state === selectedState);
    }
    if (selectedDistrict) {
      filtered = filtered.filter(hospital => hospital.district === selectedDistrict);
    }
    setFilteredHospitals(filtered);
    setVisibleCount(10); // Reset the visible count when filters change
  }, [selectedState, selectedDistrict, hospitals]);

  // Fetch blood camps
  useEffect(() => {
    const fetchBloodCamps = async () => {
      try {
        const response = await axios.get('http://localhost:3000/blood-camps');
        setBloodCamps(response.data);
      } catch (error) {
        console.error('Error fetching blood camps:', error);
      }
    };

    fetchBloodCamps();
  }, []);

  // Check if API key is set
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
      console.warn("Google Maps API key not set. Using OpenStreetMap as fallback.");
    }
  }, []);

  // Helper function to process location data
  const processLocationData = async (latitude, longitude) => {
    try {
      let locationData;
      
      if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY") {
        locationData = await reverseGeocodeWithGoogle(latitude, longitude, GOOGLE_MAPS_API_KEY);
      } else {
        locationData = await reverseGeocode(latitude, longitude);
      }
      
      const { state, district } = locationData;
      
      if (!state) {
        throw new Error("Could not determine your state from location");
      }
      
      // Find matching state
      const availableStates = [...new Set(hospitals.map(hospital => hospital.state))];
      
      if (availableStates.length === 0) {
        // If no hospital data is loaded yet, use some default states
        const defaultStates = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"];
        setSelectedState(defaultStates[0]); // Just select the first one
        setLocationError("Could not match your location. Using default state.");
        return false;
      }
      
      const stateMatch = findNearestMatch(state, "", availableStates, []);
      
      if (!stateMatch.state) {
        // If we couldn't find a match, just use the first available state
        setSelectedState(availableStates[0]);
        setLocationError("No matching state found. Using " + availableStates[0] + " as default.");
        return false;
      }
      
      // Set the state and wait for district list to update
      setSelectedState(stateMatch.state);
      
      // Get the districts for this state
      const availableDistricts = [...new Set(
        hospitals
          .filter(hospital => hospital.state === stateMatch.state)
          .map(hospital => hospital.district)
      )];
      
      console.log("Available districts:", availableDistricts);
      
      if (district && availableDistricts.length > 0) {
        // Find the best matching district
        const districtMatch = findNearestMatch("", district, [], availableDistricts);
        
        if (districtMatch.district) {
          // Short delay to ensure districts state has updated
          setTimeout(() => {
            setSelectedDistrict(districtMatch.district);
          }, 100);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error processing location data:", error);
      setLocationError(error.message || "Error processing your location");
      
      // Fallback to a default state
      const availableStates = [...new Set(hospitals.map(hospital => hospital.state))];
      if (availableStates.length > 0) {
        setSelectedState(availableStates[0]);
      }
      
      return false;
    }
  };

  // Function to get user's location and set state/district
  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError("");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          
          setUserLocation(coords);
          
          // Process the location data
          await processLocationData(coords.latitude, coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLocationError("Unable to fetch your location. Please allow location access.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  // Function to handle getting directions to a hospital
  const handleGetDirections = (hospital) => {
    if (!userLocation.latitude || !userLocation.longitude) {
      // If user location isn't available, ask for permission first
      getUserLocation();
      setSelectedHospital(hospital);
      return;
    }

    // Open Google Maps in a new tab with directions
    const destination = encodeURIComponent(`${hospital.name}, ${hospital.address}, ${hospital.district}, ${hospital.state}`);
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    
    window.open(url, '_blank');
  };

  // Open modal with different transportation options
  const openDirectionsModal = (hospital) => {
    if (!userLocation.latitude || !userLocation.longitude) {
      getUserLocation();
      setSelectedHospital(hospital);
      return;
    }
    
    setSelectedHospital(hospital);
    setShowDirectionsModal(true);
  };

  // Get directions with specific travel mode
  const getDirectionsWithMode = (mode) => {
    if (!selectedHospital || !userLocation.latitude || !userLocation.longitude) return;
    
    const destination = encodeURIComponent(`${selectedHospital.name}, ${selectedHospital.address}, ${selectedHospital.district}, ${selectedHospital.state}`);
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
    
    window.open(url, '_blank');
    setShowDirectionsModal(false);
  };

  return (
    <div className="hospital-section">
      <div className="container">
        <h2 className="section-title">Blood Donation Hospitals</h2>
        <p className="section-description">
          Find blood donation centers near you. We've listed verified hospitals where you can safely donate blood.
        </p>

        {/* Location and Filter Controls */}
        <div className="location-controls">
          <button 
            className="use-location-btn" 
            onClick={getUserLocation}
            disabled={isLocating}
          >
            <FaMapMarkerAlt /> {isLocating ? "Detecting Location..." : "Use My Location"}
          </button>
          {locationError && <div className="location-error">{locationError}</div>}
        </div>

        {/* Filter Dropdowns */}
        <div className="filters">
          <div className="filter-group">
            <label><FaHospital style={{ marginRight: '6px', color: '#e12454' }} /> State</label>
            <select 
              onChange={(e) => setSelectedState(e.target.value)} 
              value={selectedState}
              disabled={isLocating}
            >
              <option value="">All States</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><FaMapMarkerAlt style={{ marginRight: '6px', color: '#e12454' }} /> District</label>
            <select 
              onChange={(e) => setSelectedDistrict(e.target.value)} 
              value={selectedDistrict} 
              disabled={!selectedState || isLocating}
            >
              <option value="">All Districts</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            <FaHeartbeat style={{ color: '#e12454', marginRight: '8px' }} />
            <strong>{filteredHospitals.length}</strong> hospitals found
            {selectedState && ` in ${selectedState}`}
            {selectedDistrict && `, ${selectedDistrict}`}
          </p>
        </div>

        {/* Table */}
        <div className="hospital-table-container">
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>District</th>
                <th>State</th>
                <th>Directions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.length > 0 ? (
                filteredHospitals.slice(0, visibleCount).map((hospital, index) => (
                  <tr key={index}>
                    <td>{hospital.name}</td>
                    <td>{hospital.phone}</td>
                    <td>{hospital.address}</td>
                    <td>{hospital.district}</td>
                    <td>{hospital.state}</td>
                    <td className="directions-cell">
                      <button 
                        onClick={() => openDirectionsModal(hospital)} 
                        className="directions-btn"
                        title="Get directions to this hospital"
                      >
                        <div className="directions-icon-wrapper">
                          <FaMapMarkerAlt className="location-icon" />
                          <FaHeart className="heart-icon" />
                        </div>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    <FaSearch /> No hospitals found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          {filteredHospitals.length > visibleCount && (
            <button className="load-more-btn" onClick={() => setVisibleCount(visibleCount + 10)}>
              Show More
            </button>
          )}
          
          {visibleCount > 10 && (
            <button className="show-less-btn" onClick={() => setVisibleCount(10)}>
              Show Less
            </button>
          )}
        </div>

        {/* Blood Camps Section */}
        <div className="blood-camps-section">
          <div className="section-header">
            <h2>Upcoming Blood Donation Camps</h2>
            <button 
              className="toggle-btn"
              onClick={() => setShowCamps(!showCamps)}
            >
              {showCamps ? 'Hide Camps' : 'Show Camps'}
            </button>
          </div>
          
          {showCamps && (
            <div className="camps-container">
              {bloodCamps.length === 0 ? (
                <p className="no-camps-message">No upcoming blood donation camps at the moment.</p>
              ) : (
                <>
                  {bloodCamps.map(camp => (
                    <div key={camp._id} className="camp-card">
                      <div className="camp-header">
                        <h3>{camp.title}</h3>
                        <div className="camp-date-badge">
                          {new Date(camp.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="camp-hospital">
                        Organized by: {camp.hospital?.name || 'Unknown Hospital'}
                      </div>
                      
                      <div className="camp-time">
                        <i className="far fa-clock"></i> {camp.time}
                      </div>
                      
                      <div className="camp-location">
                        <i className="fas fa-map-marker-alt"></i> {camp.venue}
                        {camp.hospital?.district && camp.hospital?.state && (
                          <span>, {camp.hospital.district}, {camp.hospital.state}</span>
                        )}
                      </div>
                      
                      <div className="camp-description">
                        {camp.description}
                      </div>
                      
                      <div className="camp-contact">
                        <strong>Contact:</strong> {camp.contactPerson}, {camp.contactPhone}
                      </div>
                    </div>
                  ))}
                  <div className="view-all-camps">
                    <Link to="/blood-camps" className="view-all-camps-btn">View All Blood Camps</Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Directions Modal */}
      {showDirectionsModal && selectedHospital && (
        <div className="directions-modal-overlay" onClick={() => setShowDirectionsModal(false)}>
          <div className="directions-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Get Directions to {selectedHospital.name}</h3>
            <p className="hospital-address">{selectedHospital.address}, {selectedHospital.district}, {selectedHospital.state}</p>
            
            <div className="travel-modes">
              <button onClick={() => getDirectionsWithMode('driving')} className="travel-mode-btn driving">
                <i className="fas fa-car"></i> Driving
              </button>
              <button onClick={() => getDirectionsWithMode('walking')} className="travel-mode-btn walking">
                <i className="fas fa-walking"></i> Walking
              </button>
              <button onClick={() => getDirectionsWithMode('bicycling')} className="travel-mode-btn bicycling">
                <i className="fas fa-bicycle"></i> Cycling
              </button>
              <button onClick={() => getDirectionsWithMode('transit')} className="travel-mode-btn transit">
                <i className="fas fa-bus"></i> Transit
              </button>
            </div>
            
            <div className="directions-modal-footer">
              <button onClick={() => handleGetDirections(selectedHospital)} className="open-google-maps-btn">
                <FaExternalLinkAlt /> Open in Google Maps
              </button>
              <button onClick={() => setShowDirectionsModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowHospital2;