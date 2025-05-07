# Quick Guide: Get Your Free Google Maps API Key

Follow these simple steps to get your Google Maps API key for the Blood Donation website:

## 5-Minute Setup Process

### Step 1: Create a Google Cloud account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create a new project
1. Click on the dropdown at the top of the page
2. Click "New Project"
3. Name it "Blood Donation Website" 
4. Click "Create"

### Step 3: Enable required APIs
1. From the sidebar menu, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - "Geocoding API"
   - "Maps JavaScript API"

### Step 4: Create an API key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your new API key

### Step 5: Set up billing account
1. From the sidebar menu, go to "Billing"
2. Set up a billing account (required, but you get $200 free credit monthly)

### Step 6: Add the API key to your project
1. Create a `.env` file in your project root
2. Add: `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here`
3. Restart your development server

## Free Usage Limits
- $200 free credit per month (~40,000 API calls)
- No charges unless you exceed the free tier

## Don't want to create an API key?
The app will still work without a Google Maps API key, but will use OpenStreetMap instead, which may be less accurate for district-level information in India. 