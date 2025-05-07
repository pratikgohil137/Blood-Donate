/**
 * Application configuration settings
 * Store API keys and other configuration settings here
 */

// Google Maps API key for reverse geocoding
// We're using OpenStreetMap which doesn't require an API key
export const GOOGLE_MAPS_API_KEY = "";

// Other configuration settings can be added here
export const SETTINGS = {
  // API base URL
  apiUrl: "http://localhost:5000",
  
  // Specify if we're in development mode
  isDevelopment: true,
  
  // Default location for map (if user doesn't provide location)
  defaultMapLocation: {
    latitude: 20.5937, // Center of India
    longitude: 78.9629
  }
}; 