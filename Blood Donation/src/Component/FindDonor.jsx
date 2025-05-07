import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaInfoCircle, FaUserPlus, FaTint, FaFilter } from "react-icons/fa";
import { reverseGeocodeWithGoogle, reverseGeocode, findNearestMatch } from "../utils/geoUtils";
import { GOOGLE_MAPS_API_KEY } from "../config";
import axios from "axios";
import "../styles/FindDonor.css";
import { useNavigate } from "react-router-dom";

const FindDonor = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const navigate = useNavigate();

  // Helper function to initialize default donor data
  const initializeDefaultDonors = () => {
    // Check if donors exist in localStorage
    const existingDonors = localStorage.getItem('donors');
    if (!existingDonors) {
      // Create default donors
      const defaultDonors = [
        { id: 1, name: "John Doe", bloodType: "A-", state: "Maharashtra", district: "Mumbai", lastDonation: "2023-10-15", phone: "123-456-7890" },
        { id: 2, name: "Jane Smith", bloodType: "A-", state: "Maharashtra", district: "Pune", lastDonation: "2023-11-05", phone: "987-654-3210" },
        { id: 3, name: "Raj Kumar", bloodType: "B+", state: "Delhi", district: "New Delhi", lastDonation: "2023-09-20", phone: "555-123-4567" },
        { id: 4, name: "Priya Singh", bloodType: "AB+", state: "Karnataka", district: "Bangalore", lastDonation: "2023-10-30", phone: "777-888-9999" },
        { id: 5, name: "Amit Patel", bloodType: "O-", state: "Gujarat", district: "Ahmedabad", lastDonation: "2023-08-25", phone: "444-555-6666" }
      ];
      
      // Store in localStorage
      localStorage.setItem('donors', JSON.stringify(defaultDonors));
      console.log("Initialized default donors");
      return defaultDonors;
    }
    
    // Return parsed existing donors
    try {
      return JSON.parse(existingDonors);
    } catch (e) {
      console.error("Error parsing donors from localStorage:", e);
      return [];
    }
  };

  // Check if API key is set
  useEffect(() => {
    // Initialize default donors
    initializeDefaultDonors();
    
    // No longer checking for API key or showing warnings
    
    // Check login status
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.get('http://localhost:3000/verify-token', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Error verifying token:', error);
            // Even if API fails, consider user logged in if token exists
            setIsLoggedIn(!!token);
          }
        }
      } catch (error) {
        console.error('Error in login check:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, []);
  
  // Load donor data and set states
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        
        // First, try to fetch from server using the search-donors endpoint
        try {
          const response = await axios.get('http://localhost:3000/search-donors');
          console.log('Server response for donors:', response.data);
          
          if (response.data.status === 'success' && Array.isArray(response.data.donors)) {
            const activeDonors = response.data.donors;
            
            setDonors(activeDonors);
            setFilteredDonors(activeDonors);
            
            // Extract unique states
            const uniqueStates = [...new Set(activeDonors.map(donor => donor.state))];
            setStates(uniqueStates.length > 0 ? uniqueStates : []);
            
            setLoading(false);
            return; // Exit if server fetch was successful
          } else {
            console.error('Invalid response format from server:', response.data);
            throw new Error('Invalid server response');
          }
        } catch (apiError) {
          console.error('Error fetching donors from API:', apiError);
          // Continue to use mock data
        }
        
        // Check if there are local registered donors
        let localDonors = [];
        try {
          const localDonorsJson = localStorage.getItem('donors');
          if (localDonorsJson) {
            localDonors = JSON.parse(localDonorsJson);
            console.log("Found locally stored donors:", localDonors.length);
          }
        } catch (e) {
          console.error("Error loading donors from localStorage:", e);
        }
        
        // Use mock data as fallback
        let mockDonors = [
          { id: 1, name: "John Doe", bloodType: "A-", state: "Maharashtra", district: "Mumbai", lastDonation: "2023-10-15", phone: "123-456-7890" },
          { id: 2, name: "Jane Smith", bloodType: "A-", state: "Maharashtra", district: "Pune", lastDonation: "2023-11-05", phone: "987-654-3210" },
          { id: 3, name: "Raj Kumar", bloodType: "B+", state: "Delhi", district: "New Delhi", lastDonation: "2023-09-20", phone: "555-123-4567" },
          { id: 4, name: "Priya Singh", bloodType: "AB+", state: "Karnataka", district: "Bangalore", lastDonation: "2023-10-30", phone: "777-888-9999" },
          { id: 5, name: "Amit Patel", bloodType: "O-", state: "Gujarat", district: "Ahmedabad", lastDonation: "2023-08-25", phone: "444-555-6666" }
        ];
        
        // If we have local donors, merge them with mock data
        if (localDonors.length > 0) {
          // Add local donors, avoid duplicates by checking id
          for (const localDonor of localDonors) {
            if (!mockDonors.some(donor => donor.id === localDonor.id)) {
              mockDonors.push({
                id: localDonor.id,
                name: localDonor.fullName || localDonor.name,
                bloodType: localDonor.bloodType,
                state: localDonor.state,
                district: localDonor.district,
                lastDonation: localDonor.lastDonation,
                phone: localDonor.phone
              });
            }
          }
        }
        
        // Add the current user if they have registered as a donor
        const storedDonorData = localStorage.getItem('donor_registration');
        if (storedDonorData) {
          try {
            const userData = JSON.parse(storedDonorData);
            if (userData && userData.fullName) {
              // Check if this user is already in our mockDonors array
              const userExists = mockDonors.some(donor => 
                (userData.email && donor.email === userData.email) || 
                (userData.phone && donor.phone === userData.phone) ||
                (userData.fullName && donor.name === userData.fullName)
              );
              
              if (!userExists) {
                const userDonor = {
                  id: 999, // Just use a high number for demo
                  name: userData.fullName || "Current User",
                  bloodType: userData.bloodType || "A+",
                  state: userData.state || "Maharashtra",
                  district: userData.district || "Mumbai",
                  lastDonation: userData.lastDonation || new Date().toISOString().split('T')[0],
                  phone: userData.phone || "999-999-9999"
                };
                
                // Add current user to the mock donors list
                mockDonors = [userDonor, ...mockDonors];
              }
            }
          } catch (err) {
            console.error('Error parsing stored donor data:', err);
          }
        }
        
        console.log("Final donors list:", mockDonors.length, mockDonors);
        setDonors(mockDonors);
        setFilteredDonors(mockDonors);
        
        // Extract unique states from mock data
        const uniqueStates = [...new Set(mockDonors.map(donor => donor.state))];
        setStates(uniqueStates);
        
        setLoading(false);
      } catch (error) {
        console.error('Error in donor fetching process:', error);
        setError('Failed to load donor data. Please try again later.');
        setLoading(false);
        
        // Fallback to basic mock data if everything else fails
        const basicMockDonors = [
          { id: 1, name: "John Doe", bloodType: "A-", state: "Maharashtra", district: "Mumbai", lastDonation: "2023-10-15", phone: "123-456-7890" },
          { id: 2, name: "Jane Smith", bloodType: "A-", state: "Maharashtra", district: "Pune", lastDonation: "2023-11-05", phone: "987-654-3210" }
        ];
        
        setDonors(basicMockDonors);
        setFilteredDonors(basicMockDonors);
        setStates(['Maharashtra']);
      }
    };

    fetchDonors();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (selectedState) {
      const filteredDistricts = [...new Set(donors
        .filter(donor => donor.state === selectedState)
        .map(donor => donor.district)
      )];
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
    
    if (!isLocating) {
      setSelectedDistrict(""); 
    }
  }, [selectedState, donors, isLocating]);

  // Replace the filter effect with a search API call
  useEffect(() => {
    const fetchFilteredDonors = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for the search
        const params = {};
        if (selectedBloodType && selectedBloodType !== "All Types") {
          // Send both parameter names to handle server-side differences
          params.bloodType = selectedBloodType;
          params.bloodGroup = selectedBloodType;
        }
        if (selectedState && selectedState !== "All States") {
          params.state = selectedState;
        }
        if (selectedDistrict && selectedDistrict !== "All Districts") {
          params.district = selectedDistrict;
        }
        
        console.log("Searching donors with params:", params);
        
        // Try to fetch from API first
        try {
          const response = await axios.get('http://localhost:3000/search-donors', { params });
          console.log('Search response:', response.data);
          
          if (response.data.status === 'success' && Array.isArray(response.data.donors)) {
            setFilteredDonors(response.data.donors);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.error('Error searching donors from API:', apiError);
          // Fall back to local filtering if API fails
        }
        
        // Local filtering fallback
        let filtered = [...donors];
        
        if (selectedState && selectedState !== "All States") {
          filtered = filtered.filter(donor => donor.state === selectedState);
        }
        
        if (selectedDistrict && selectedDistrict !== "All Districts") {
          filtered = filtered.filter(donor => donor.district === selectedDistrict);
        }
        
        if (selectedBloodType && selectedBloodType !== "All Types") {
          filtered = filtered.filter(donor => 
            donor.bloodType === selectedBloodType || donor.bloodGroup === selectedBloodType
          );
        }
        
        console.log("Filtering donors locally:", {
          total: donors.length,
          filtered: filtered.length,
          state: selectedState,
          district: selectedDistrict,
          bloodType: selectedBloodType
        });
        
        setFilteredDonors(filtered);
      } catch (error) {
        console.error('Error in donor filtering:', error);
        // If all else fails, just do local filtering
        let filtered = [...donors];
        
        if (selectedState && selectedState !== "All States") {
          filtered = filtered.filter(donor => donor.state === selectedState);
        }
        
        if (selectedDistrict && selectedDistrict !== "All Districts") {
          filtered = filtered.filter(donor => donor.district === selectedDistrict);
        }
        
        if (selectedBloodType && selectedBloodType !== "All Types") {
          filtered = filtered.filter(donor => 
            donor.bloodType === selectedBloodType || donor.bloodGroup === selectedBloodType
          );
        }
        
        setFilteredDonors(filtered);
      } finally {
        setLoading(false);
        setVisibleCount(10); // Reset the visible count when filters change
      }
    };
    
    fetchFilteredDonors();
  }, [selectedState, selectedDistrict, selectedBloodType, donors]);

  // Helper function to process location data (similar to ShowHospital2)
  const processLocationData = async (latitude, longitude) => {
    try {
      let locationData;
      
      // Always use OpenStreetMap and don't show API warnings
      locationData = await reverseGeocode(latitude, longitude);
      
      const { state, district } = locationData;
      
      if (!state) {
        throw new Error("Could not determine your state from location");
      }
      
      // Find matching state
      const availableStates = [...new Set(donors.map(donor => donor.state))];
      
      if (availableStates.length === 0) {
        // If no donor data is loaded yet, use some default states
        const defaultStates = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"];
        setSelectedState(defaultStates[0]); // Just select the first one
        return false;
      }
      
      const stateMatch = findNearestMatch(state, "", availableStates, []);
      
      if (!stateMatch.state) {
        // If we couldn't find a match, just use the first available state
        setSelectedState(availableStates[0]);
        return false;
      }
      
      setSelectedState(stateMatch.state);
      
      // Get the districts for this state
      const availableDistricts = [...new Set(
        donors
          .filter(donor => donor.state === stateMatch.state)
          .map(donor => donor.district)
      )];
      
      if (district && availableDistricts.length > 0) {
        const districtMatch = findNearestMatch("", district, [], availableDistricts);
        
        if (districtMatch.district) {
          setTimeout(() => {
            setSelectedDistrict(districtMatch.district);
          }, 100);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error processing location data:", error);
      
      // Fallback to a default state
      const availableStates = [...new Set(donors.map(donor => donor.state))];
      if (availableStates.length > 0) {
        setSelectedState(availableStates[0]);
      }
      
      return false;
    }
  };

  // Function to get user's location and set state/district
  const getUserLocation = () => {
    setIsLocating(true);
    // Don't show any error messages
    
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
          setIsLocating(false);
          
          // Set a default state if location fails
          if (states.length > 0) {
            setSelectedState(states[0]);
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setIsLocating(false);
      
      // Set a default state if geolocation is not supported
      if (states.length > 0) {
        setSelectedState(states[0]);
      }
    }
  };

  // Function to handle becoming a donor
  const handleBecomeDonor = () => {
    try {
      // First try to navigate to the registration page
      navigate('/donor-registration');
    } catch (navError) {
      console.error("Navigation error:", navError);
      
      // If navigation fails, show a modal/prompt to collect basic donor info
      const confirmRegister = window.confirm(
        "Would you like to quickly register as a donor now? This will add your information to our donor database."
      );
      
      if (confirmRegister) {
        registerDonorDirectly();
      }
    }
  };
  
  // Helper function to directly register a donor via prompt
  const registerDonorDirectly = () => {
    try {
      // Collect basic information
      const fullName = prompt("Enter your full name:");
      if (!fullName) return; // User canceled
      
      const bloodType = prompt("Enter your blood type (A+, A-, B+, B-, AB+, AB-, O+, O-):");
      if (!bloodType) return; // User canceled
      
      const phone = prompt("Enter your phone number:");
      if (!phone) return; // User canceled
      
      const state = prompt("Enter your state:");
      if (!state) return; // User canceled
      
      const district = prompt("Enter your district:");
      if (!district) return; // User canceled
      
      // Create donor object
      const newDonor = {
        id: Date.now(), // Use timestamp as ID
        fullName: fullName,
        name: fullName, // For compatibility
        bloodType: bloodType,
        phone: phone,
        state: state,
        district: district,
        lastDonation: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString(),
        isVerified: true, // For demo
        donationStatus: 'active', // For demo
      };
      
      // Save to localStorage
      // 1. As individual registration
      localStorage.setItem('donor_registration', JSON.stringify(newDonor));
      
      // 2. Add to donors array
      try {
        const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
        existingDonors.push(newDonor);
        localStorage.setItem('donors', JSON.stringify(existingDonors));
      } catch (e) {
        localStorage.setItem('donors', JSON.stringify([newDonor]));
      }
      
      // Update state to show the new donor
      const updatedDonors = [...donors, newDonor];
      setDonors(updatedDonors);
      setFilteredDonors(updatedDonors);
      
      // Update states list if needed
      if (!states.includes(state)) {
        setStates([...states, state]);
      }
      
      // Show success message
      alert("You have been registered as a donor successfully!");
      
      // Set filters to show the new donor
      setSelectedBloodType(bloodType);
      setSelectedState(state);
      setSelectedDistrict(district);
      
    } catch (error) {
      console.error("Error registering donor directly:", error);
      alert("There was an error registering you as a donor. Please try again or use the full registration form.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="donor-section loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading donor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-section">
      <div className="container">
        <h2 className="section-title">Find Blood Donors</h2>
        <p className="section-description">
          Connect with verified blood donors in your area. Filter by blood type and location to find the right match.
        </p>

        {/* Become a donor button */}
        <div className="become-donor-section">
          <button className="become-donor-btn" onClick={handleBecomeDonor}>
            <FaUserPlus /> Become a Donor
          </button>
          <p className="donor-note">
            Already registered? Your profile will be visible to those in need after verification.
          </p>
        </div>

        {/* Location and Filter Controls */}
        <div className="search-controls">
          <div className="search-header">
            <h3>Search for Donors</h3>
            <button 
              className="filter-toggle-btn" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className={`filters-container ${showFilters ? 'show' : ''}`}>
            <div className="location-controls">
              <button 
                className="use-location-btn" 
                onClick={getUserLocation}
                disabled={isLocating}
              >
                <FaMapMarkerAlt /> {isLocating ? "Detecting Location..." : "Use My Location"}
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div className="filters">
              <div className="filter-group">
                <label>Blood Type</label>
                <select 
                  onChange={(e) => setSelectedBloodType(e.target.value)} 
                  value={selectedBloodType}
                >
                  <option value="">All Types</option>
                  {bloodTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>State</label>
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
                <label>District</label>
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
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              <strong>{filteredDonors.length}</strong> donors found
              {selectedBloodType && ` with blood type ${selectedBloodType}`}
              {selectedState && selectedState !== "All States" && ` in ${selectedState}`}
              {selectedDistrict && selectedDistrict !== "All Districts" && `, ${selectedDistrict}`}
            </p>
          </div>
        </div>

        {/* Donors Table */}
        <div className="donors-table-container">
          <table className="donors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood Type</th>
                <th>Location</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.length > 0 ? (
                filteredDonors.slice(0, visibleCount).map((donor, index) => (
                  <tr key={index}>
                    <td>{donor.name}</td>
                    <td>
                      <span className="blood-type-text">
                        {donor.bloodType || donor.bloodGroup}
                      </span>
                    </td>
                    <td>{donor.district}, {donor.state}</td>
                    <td>
                      <span className="contact-text">
                        {donor.phone || donor.contact}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    <FaSearch /> No donors found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          {filteredDonors.length > visibleCount && (
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

        {/* Information Section */}
        <div className="donor-info-section">
          <h3>How It Works</h3>
          <div className="info-steps">
            <div className="info-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Find a Donor</h4>
                <p>Search for donors by blood type and location</p>
              </div>
            </div>
            <div className="info-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Contact</h4>
                <p>Reach out to potential donors through our secure system</p>
              </div>
            </div>
            <div className="info-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Connect</h4>
                <p>Coordinate with the donor for blood donation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDonor; 