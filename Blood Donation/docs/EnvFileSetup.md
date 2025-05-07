# Setting Up Your .env File

For security reasons, API keys should not be hardcoded directly in your application files. Instead, use an environment file (`.env`) to store sensitive information like API keys.

## Creating a .env File

1. Create a new file named `.env` in the root directory of your project (same level as `package.json`)
2. Add your Google Maps API key in the following format:

```
# Blood Donation Website Environment Variables

# Google Maps API Key for reverse geocoding
# Replace with your own API key from Google Cloud Console
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCqB_uEryj3tTPKcarq1ZSVPW-NW95WlfY
```

3. Save this file and restart your development server

## Important Security Notes

- **NEVER commit your `.env` file to version control**
- The `.gitignore` file should already contain `.env` to prevent accidental commits
- Each developer on your team should create their own `.env` file locally
- For production deployments, set environment variables in your hosting platform

## Accessing Environment Variables in Vite

In your Vite application, you can access environment variables using:

```javascript
// In src/config.js
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "fallback_value";
```

Note: In Vite, all environment variables must be prefixed with `VITE_` to be exposed to your client-side code.

## Verifying Setup

To verify your environment variables are working correctly:

1. Make sure your `.env` file is in the correct location
2. Restart your development server
3. Open your browser console and check if there are any API key errors
4. Try using the "Use My Location" feature on the Hospital Locator page 