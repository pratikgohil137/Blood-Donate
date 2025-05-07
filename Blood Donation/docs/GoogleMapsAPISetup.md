# Google Maps API Key Setup Guide

This guide will walk you through the process of creating a Google Maps API key for your Blood Donation website's geocoding functionality. The API key will be used to automatically detect a user's district and state based on their location.

## What is Google Maps API?

Google Maps API allows you to integrate Google Maps functionality into your website. For our Blood Donation website, we're specifically using:

1. **Geocoding API** - Converts geographic coordinates (latitude/longitude) into human-readable addresses (including state and district)
2. **Maps JavaScript API** - Required for basic maps functionality

## Free Tier Usage

Google Maps API offers a generous free tier:
- $200 monthly credit (enough for approximately 40,000 API calls per month)
- No credit card is charged unless you exceed this limit

## Step-by-Step Setup Guide

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account (create one if needed)
3. Click on the project dropdown at the top of the page
4. Click on "New Project"
5. Enter a name for your project (e.g., "Blood Donation Website")
6. Click "Create"

### 2. Enable the Required APIs

1. In your new project, go to the "APIs & Services" > "Library" section from the navigation menu
2. Search for and enable the following APIs (click each one and click "Enable"):
   - **Geocoding API** (for reverse geocoding)
   - **Maps JavaScript API** (for basic maps functionality)

### 3. Create an API Key

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Your new API key will be displayed - copy it immediately
4. Click "Restrict Key" to set up security measures

### 4. Configure API Key Restrictions (Optional but Recommended)

1. Set "Application restrictions" to "HTTP referrers"
2. Under "Website restrictions", add your website domain:
   - For development: `http://localhost:*` and `http://127.0.0.1:*`
   - For production: Add your actual domain (e.g., `https://yourwebsite.com/*`)
3. Under "API restrictions", select "Restrict key" and select only the APIs you need:
   - Geocoding API
   - Maps JavaScript API
4. Click "Save"

### 5. Set Up Billing (Required, but won't charge unless you exceed limits)

1. In the Google Cloud Console, go to "Billing"
2. Click "Link a billing account" or "Create account"
3. Follow the steps to set up a billing account with your information
4. Set budget alerts to avoid unexpected charges

## Implementing the API Key in the Blood Donation Website

### Option 1: Using Environment Variables (Recommended)

1. Create a `.env` file in the root of your project
2. Add the following line:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with the API key you copied
4. Restart your development server

### Option 2: Direct Config Update (Not recommended for production)

1. Open the `src/config.js` file
2. Replace the placeholder text with your actual API key:
   ```javascript
   export const GOOGLE_MAPS_API_KEY = "your_api_key_here";
   ```

## Testing Your API Key

1. Start your application
2. Navigate to the Hospital Locator page
3. Click "Use My Location"
4. If configured correctly, the app should detect your state and district

## Troubleshooting

- **API Key Not Working**: Make sure the correct APIs are enabled in your Google Cloud Console
- **Billing Issues**: Verify your billing account is properly set up
- **CORS Errors**: Make sure your domain restrictions are correctly configured

If you need additional help, refer to the [Google Maps Platform Documentation](https://developers.google.com/maps/documentation). 