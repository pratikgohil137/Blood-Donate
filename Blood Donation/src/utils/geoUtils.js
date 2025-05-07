/**
 * Utility functions for geolocation and mapping
 */

/**
 * Reverse geocode coordinates using Google Maps API to get address information including state and district
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<{state: string, district: string}>} State and district information
 */
export const reverseGeocodeWithGoogle = async (latitude, longitude, apiKey) => {
  try {
    if (!apiKey) {
      throw new Error('Google Maps API key is required');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data from Google Maps API');
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`);
    }
    
    // Extract state and district from the address components
    let state = '';
    let district = '';
    
    for (const component of data.results[0]?.address_components || []) {
      // For India: administrative_area_level_1 is state, administrative_area_level_2 is district
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      
      if (component.types.includes('administrative_area_level_2')) {
        district = component.long_name;
      }
    }
    
    return { state, district };
  } catch (error) {
    console.error('Error during Google Maps reverse geocoding:', error);
    // Fall back to OpenStreetMap if Google fails
    return reverseGeocode(latitude, longitude);
  }
};

/**
 * Reverse geocode coordinates to get address information including state and district
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Promise<{state: string, district: string}>} State and district information
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding (free and doesn't require API key)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          // Add a custom user agent to comply with Nominatim's usage policy
          'User-Agent': 'BloodDonationApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    // Extract state and district from response
    // Note: Nominatim uses different property names based on the country
    // We'll try to handle the most common cases
    
    let state = '';
    // Try different potential state identifiers
    if (data.address.state) {
      state = data.address.state;
    } else if (data.address.province) {
      state = data.address.province;
    } else if (data.address.region) {
      state = data.address.region;
    }
    
    let district = '';
    // Try different potential district identifiers
    if (data.address.district) {
      district = data.address.district;
    } else if (data.address.county) {
      district = data.address.county;
    } else if (data.address.city) {
      district = data.address.city;
    }
    
    return { state, district };
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return { state: '', district: '' };
  }
};

/**
 * Find nearest match for state and district in available options
 * @param {string} state - State from geocoding
 * @param {string} district - District from geocoding
 * @param {Array} availableStates - Available states in the dataset
 * @param {Array} availableDistricts - Available districts for the state
 * @returns {{state: string, district: string}} Best matching state and district
 */
export const findNearestMatch = (state, district, availableStates, availableDistricts) => {
  // Find best matching state
  let bestState = '';
  let bestStateScore = 0;
  
  if (state && availableStates.length > 0) {
    // Normalize input
    const normalizedState = state.toLowerCase().trim();
    
    for (const availableState of availableStates) {
      const normalizedAvailableState = availableState.toLowerCase().trim();
      
      // Exact match
      if (normalizedState === normalizedAvailableState) {
        bestState = availableState;
        break;
      }
      
      // Partial match
      if (normalizedState.includes(normalizedAvailableState) || 
          normalizedAvailableState.includes(normalizedState)) {
        const score = Math.min(normalizedState.length, normalizedAvailableState.length) / 
                      Math.max(normalizedState.length, normalizedAvailableState.length);
        
        if (score > bestStateScore) {
          bestStateScore = score;
          bestState = availableState;
        }
      }
    }
  }
  
  // Find best matching district if we have districts to match against
  let bestDistrict = '';
  let bestDistrictScore = 0;
  
  if (district && availableDistricts.length > 0) {
    // Normalize input
    const normalizedDistrict = district.toLowerCase().trim();
    
    for (const availableDistrict of availableDistricts) {
      const normalizedAvailableDistrict = availableDistrict.toLowerCase().trim();
      
      // Exact match
      if (normalizedDistrict === normalizedAvailableDistrict) {
        bestDistrict = availableDistrict;
        break;
      }
      
      // Partial match
      if (normalizedDistrict.includes(normalizedAvailableDistrict) || 
          normalizedAvailableDistrict.includes(normalizedDistrict)) {
        const score = Math.min(normalizedDistrict.length, normalizedAvailableDistrict.length) / 
                      Math.max(normalizedDistrict.length, normalizedAvailableDistrict.length);
        
        if (score > bestDistrictScore) {
          bestDistrictScore = score;
          bestDistrict = availableDistrict;
        }
      }
    }
  }
  
  return { 
    state: bestState, 
    district: bestDistrict
  };
}; 