import React, { useState, useEffect } from 'react';
import { FaUser, FaTint, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/DonorRegistration.css';

const DonorRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodType: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
    state: '',
    district: '',
    address: '',
    lastDonation: '',
    hasMedicalConditions: 'no',
    medicalConditionsDetails: '',
    hasRecentSurgery: 'no',
    recentSurgeryDetails: '',
    isTakingMedications: 'no',
    medicationsDetails: '',
    canDonateRegularly: 'yes',
    emergencyOnly: false,
    consent: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Check login status and load user data if logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.get('http://localhost:3000/user-profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsLoggedIn(true);
            setUserData(response.data);
            
            // Pre-fill form with user data
            if (response.data) {
              setFormData(prevData => ({
                ...prevData,
                fullName: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
              }));
            }
          } catch (apiError) {
            console.error('API error:', apiError);
            // Continue anyway with token in place, assuming user is logged in
            // This allows the form to work even if backend is unreachable
            setIsLoggedIn(true);
          }
        } else {
          // For demo purposes, we'll allow registration without login
          // In production, uncomment this:
          // navigate('/login?redirect=donor-registration');
          console.warn('No token found but allowing registration for demo purposes');
        }
      } catch (error) {
        console.error('Error verifying login status:', error);
        // For demo purposes, we'll allow registration without login
        // In production, uncomment this:
        // navigate('/login?redirect=donor-registration');
      }
    };
    
    checkLoginStatus();
    
    // Load states (mock data for now)
    setStates([
      'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 
      'Gujarat', 'West Bengal', 'Telangana', 'Rajasthan', 'Kerala',
      'Andhra Pradesh', 'Odisha', 'Haryana', 'Punjab', 'Jammu and Kashmir',
      'Himachal Pradesh', 'Chandigarh', 'Uttarakhand', 'Jharkhand', 'Bihar',
      'Assam', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram',
      'Tripura', 'Nagaland', 'Sikkim', 'Andaman and Nicobar Islands',
      'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep', 'Puducherry'
    ]);
  }, [navigate]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state) {
      // In a real app, fetch districts based on selected state
      // For now, using mock data
      const mockDistricts = {
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
        'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Bharuch'],
        'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
        'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam']
      };
      
      setDistricts(mockDistricts[formData.state] || []);
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkbox inputs, use the checked property
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
    
    // Show/hide condition details inputs based on yes/no answers
    if (name === 'hasMedicalConditions' && value === 'no') {
      setFormData(prev => ({ ...prev, medicalConditionsDetails: '' }));
    }
    if (name === 'hasRecentSurgery' && value === 'no') {
      setFormData(prev => ({ ...prev, recentSurgeryDetails: '' }));
    }
    if (name === 'isTakingMedications' && value === 'no') {
      setFormData(prev => ({ ...prev, medicationsDetails: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) errors.phone = "Phone number must be 10 digits";
    if (!formData.bloodType) errors.bloodType = "Blood type is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.weight.trim()) errors.weight = "Weight is required";
    else if (parseInt(formData.weight) < 45) errors.weight = "Weight must be at least 45 kg to donate blood";
    if (!formData.state) errors.state = "State is required";
    if (!formData.district) errors.district = "District is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    
    // Conditional required fields
    if (formData.hasMedicalConditions === 'yes' && !formData.medicalConditionsDetails.trim()) {
      errors.medicalConditionsDetails = "Please provide details about your medical conditions";
    }
    if (formData.hasRecentSurgery === 'yes' && !formData.recentSurgeryDetails.trim()) {
      errors.recentSurgeryDetails = "Please provide details about your recent surgery";
    }
    if (formData.isTakingMedications === 'yes' && !formData.medicationsDetails.trim()) {
      errors.medicationsDetails = "Please provide details about your medications";
    }
    
    // Consent is required
    if (!formData.consent) errors.consent = "You must consent to the terms and privacy policy";
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Send data to the backend API
      let response;
      const token = localStorage.getItem('token');
      
      try {
        // Make API call without requiring token
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        response = await axios.post('http://localhost:3000/register-donor', formData, {
          headers: headers
        });
        console.log('Server response:', response.data);
        
        // If successful, show success state
        if (response.data.status === 'success') {
          setFormSubmitted(true);
          // Scroll to top to show success message
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Save minimal donor data to localStorage for demo/offline functionality
          const donorData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            bloodType: formData.bloodType,
            state: formData.state,
            district: formData.district,
            lastDonation: formData.lastDonation || new Date().toISOString().split('T')[0],
            registrationDate: new Date().toISOString(),
            status: 'active',
            address: formData.address,
            gender: formData.gender,
            weight: formData.weight,
            dateOfBirth: formData.dateOfBirth
          };
          
          localStorage.setItem('donor_registration', JSON.stringify(donorData));
          
          // Also add to localStorage donors array if it exists (for demo mode)
          try {
            const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
            
            // Check if user is already registered
            const existingDonorIndex = existingDonors.findIndex(donor => 
              donor.email === formData.email || donor.phone === formData.phone
            );
            
            if (existingDonorIndex >= 0) {
              // Update existing donor record
              existingDonors[existingDonorIndex] = {
                ...existingDonors[existingDonorIndex],
                ...donorData,
                id: existingDonors[existingDonorIndex].id
              };
            } else {
              // Add new donor record
              existingDonors.push({
                ...donorData,
                id: Date.now() // Use timestamp as ID
              });
            }
            
            localStorage.setItem('donors', JSON.stringify(existingDonors));
          } catch (storageError) {
            console.error('Error updating donors in localStorage:', storageError);
          }
          
          // Redirect to donor profile/dashboard after a delay
          setTimeout(() => {
            navigate('/find-donor');
          }, 3000);
        } else {
          throw new Error(response.data.error || 'Failed to register donor');
        }
      } catch (apiError) {
        console.error('API error details:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status
        });
        
        // Use offline registration in case of API errors
        processOfflineRegistration();
      }
    } catch (error) {
      console.error('Error submitting donor registration:', error);
      // Handle submission error
      setFormErrors({
        submission: error.message || "There was an error submitting your form. Please try again."
      });
    }
  };
  
  // Function to handle offline registration when API is unavailable
  const processOfflineRegistration = () => {
    console.log('Processing offline registration');
    
    // Prepare donor data for storage
    const donorData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      bloodType: formData.bloodType,
      state: formData.state,
      district: formData.district,
      lastDonation: formData.lastDonation || new Date().toISOString().split('T')[0],
      registrationDate: new Date().toISOString(),
      status: 'pending_sync', // Mark as needing sync when online
      isVerified: true, // For demo purposes
      donationStatus: 'active', // For demo purposes
      address: formData.address,
      gender: formData.gender,
      weight: formData.weight,
      dateOfBirth: formData.dateOfBirth
    };
    
    // Save form data to localStorage for demo purposes
    localStorage.setItem('donor_registration', JSON.stringify(donorData));
    
    // Also add to localStorage donors array
    try {
      const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
      
      // Check if user is already registered
      const existingDonorIndex = existingDonors.findIndex(donor => 
        donor.email === formData.email || donor.phone === formData.phone
      );
      
      if (existingDonorIndex >= 0) {
        // Update existing donor record
        existingDonors[existingDonorIndex] = {
          ...existingDonors[existingDonorIndex],
          ...donorData,
          id: existingDonors[existingDonorIndex].id
        };
      } else {
        // Add new donor record
        existingDonors.push({
          ...donorData,
          id: Date.now() // Use timestamp as ID
        });
      }
      
      localStorage.setItem('donors', JSON.stringify(existingDonors));
    } catch (storageError) {
      console.error('Error updating donors in localStorage:', storageError);
    }
    
    // Show success state despite being offline
    setFormSubmitted(true);
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Redirect to donor profile/dashboard after a delay
    setTimeout(() => {
      navigate('/find-donor');
    }, 3000);
  };

  // Show success state
  if (formSubmitted) {
    return (
      <div className="donor-registration-success">
        <div className="success-container">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h2>Thank You for Registering as a Blood Donor!</h2>
          <p>Your registration has been submitted successfully. Our team will review your information and you'll be added to our donor database soon.</p>
          <p className="redirect-message">You will be redirected to your dashboard in a few seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-registration-page">
      <div className="container">
        <div className="form-header">
          <h1>Become a Blood Donor</h1>
          <p>Fill out this form to register as a blood donor and help save lives</p>
        </div>
        
        {/* General error message */}
        {formErrors.submission && (
          <div className="submission-error">
            {formErrors.submission}
          </div>
        )}
        
        <form className="donor-registration-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2><FaUser /> Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name*</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={formErrors.fullName ? 'error' : ''}
                />
                {formErrors.fullName && <div className="error-message">{formErrors.fullName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth*</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={formErrors.dateOfBirth ? 'error' : ''}
                />
                {formErrors.dateOfBirth && <div className="error-message">{formErrors.dateOfBirth}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender*</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={formErrors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.gender && <div className="error-message">{formErrors.gender}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)*</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  className={formErrors.weight ? 'error' : ''}
                />
                {formErrors.weight && <div className="error-message">{formErrors.weight}</div>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2><FaTint /> Blood Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type*</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className={formErrors.bloodType ? 'error' : ''}
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formErrors.bloodType && <div className="error-message">{formErrors.bloodType}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastDonation">Last Donation Date (if any)</label>
                <input
                  type="date"
                  id="lastDonation"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2><FaMapMarkerAlt /> Location Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">State*</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={formErrors.state ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {formErrors.state && <div className="error-message">{formErrors.state}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="district">District*</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                  className={formErrors.district ? 'error' : ''}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {formErrors.district && <div className="error-message">{formErrors.district}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Complete Address*</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={formErrors.address ? 'error' : ''}
              ></textarea>
              {formErrors.address && <div className="error-message">{formErrors.address}</div>}
            </div>
          </div>
          
          <div className="form-section">
            <h2><FaCalendarAlt /> Medical Information</h2>
            
            <div className="form-group">
              <label>Do you have any chronic medical conditions?*</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasMedicalConditions"
                    value="yes"
                    checked={formData.hasMedicalConditions === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasMedicalConditions"
                    value="no"
                    checked={formData.hasMedicalConditions === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              
              {formData.hasMedicalConditions === 'yes' && (
                <div className="conditional-input">
                  <label htmlFor="medicalConditionsDetails">Please provide details*</label>
                  <textarea
                    id="medicalConditionsDetails"
                    name="medicalConditionsDetails"
                    value={formData.medicalConditionsDetails}
                    onChange={handleChange}
                    className={formErrors.medicalConditionsDetails ? 'error' : ''}
                  ></textarea>
                  {formErrors.medicalConditionsDetails && (
                    <div className="error-message">{formErrors.medicalConditionsDetails}</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Have you had any surgeries in the last 6 months?*</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasRecentSurgery"
                    value="yes"
                    checked={formData.hasRecentSurgery === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasRecentSurgery"
                    value="no"
                    checked={formData.hasRecentSurgery === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              
              {formData.hasRecentSurgery === 'yes' && (
                <div className="conditional-input">
                  <label htmlFor="recentSurgeryDetails">Please provide details*</label>
                  <textarea
                    id="recentSurgeryDetails"
                    name="recentSurgeryDetails"
                    value={formData.recentSurgeryDetails}
                    onChange={handleChange}
                    className={formErrors.recentSurgeryDetails ? 'error' : ''}
                  ></textarea>
                  {formErrors.recentSurgeryDetails && (
                    <div className="error-message">{formErrors.recentSurgeryDetails}</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Are you currently taking any medications?*</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="isTakingMedications"
                    value="yes"
                    checked={formData.isTakingMedications === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="isTakingMedications"
                    value="no"
                    checked={formData.isTakingMedications === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              
              {formData.isTakingMedications === 'yes' && (
                <div className="conditional-input">
                  <label htmlFor="medicationsDetails">Please provide details*</label>
                  <textarea
                    id="medicationsDetails"
                    name="medicationsDetails"
                    value={formData.medicationsDetails}
                    onChange={handleChange}
                    className={formErrors.medicationsDetails ? 'error' : ''}
                  ></textarea>
                  {formErrors.medicationsDetails && (
                    <div className="error-message">{formErrors.medicationsDetails}</div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h2><FaEnvelope /> Donation Preferences</h2>
            
            <div className="form-group">
              <label>Are you willing to donate blood regularly?*</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="canDonateRegularly"
                    value="yes"
                    checked={formData.canDonateRegularly === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="canDonateRegularly"
                    value="no"
                    checked={formData.canDonateRegularly === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="emergencyOnly"
                  checked={formData.emergencyOnly}
                  onChange={handleChange}
                />
                Contact me for emergency donations only
              </label>
            </div>
            
            <div className="form-group consent-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className={formErrors.consent ? 'error' : ''}
                />
                I agree to the terms and conditions and privacy policy. I certify that all information provided is accurate.*
              </label>
              {formErrors.consent && <div className="error-message">{formErrors.consent}</div>}
            </div>
          </div>
          
          <div className="info-section">
            <h3>After Donation Information</h3>
            <p>After you have donated blood, you can remove yourself from the active donors list by visiting your profile page. 
               This helps us maintain an accurate database of available donors.</p>
            <p>Once you make a donation, you can log it in your profile and then choose to delete your donor record if you wish.</p>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">Register as Donor</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/find-donor')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorRegistration; 