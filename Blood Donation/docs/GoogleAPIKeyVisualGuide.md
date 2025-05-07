# Visual Guide to Obtaining a Google Maps API Key

This guide provides descriptions of the Google Cloud Console UI elements to help you navigate and obtain your API key.

## 1. Google Cloud Console Homepage

When you first visit [Google Cloud Console](https://console.cloud.google.com/), you'll see:
- A blue navigation bar at the top
- A project selector dropdown in the top-left (says "Select a project" if none selected)
- A search bar in the top-center
- Your Google account avatar in the top-right

## 2. Creating a New Project

After clicking "New Project":
- A dialog box will appear with:
  - Project name field (enter "Blood Donation Website")
  - Organization dropdown (usually optional)
  - Location dropdown (usually optional)
  - "Create" button at the bottom

## 3. Navigating to APIs & Services

Look for:
- A hamburger menu (☰) in the top-left corner
- Click it to expand the sidebar menu
- Scroll down to find "APIs & Services" with a dropdown arrow
- Click "APIs & Services" then select "Library"

## 4. The API Library

In the API Library:
- A search bar at the top to find specific APIs
- Category filters on the left side 
- Popular APIs displayed as cards in the center
- Search for "Geocoding API" and "Maps JavaScript API"

## 5. Enabling an API

After clicking on an API:
- You'll see a blue "Enable" button near the top
- Click "Enable" for each required API
- You'll be redirected to the API dashboard after enabling

## 6. Creating Credentials

To create an API key:
- In the API dashboard, click "Create Credentials" at the top
- Select "API key" from the dropdown
- A dialog will appear with your new API key
- Copy this key immediately and save it in a secure location

## 7. Setting Up Billing

For billing setup:
- In the sidebar menu, find and click "Billing"
- Click "Link a billing account" or "Create account"
- Follow the prompts to set up payment information
- You won't be charged unless you exceed the free tier ($200/month credit)

## 8. Restricting Your API Key (Optional but Recommended)

After creating your key:
- Click "Restrict Key" in the key creation dialog, or
- Go to API & Services > Credentials and click the edit (pencil) icon for your key
- Under "Application restrictions", select "HTTP referrers"
- Add your domains (e.g., localhost:* for development)
- Under "API restrictions", select the specific APIs you enabled

## 9. Viewing Your API Keys Later

If you need to view your keys later:
- Go to the hamburger menu (☰) > APIs & Services > Credentials
- Your API keys will be listed under the "API Keys" section
- Click the copy icon next to a key to copy it
- Note: You can only see the full key when initially created, later it will be partially hidden

## 10. Adding the Key to Your Project

Create a text file named `.env` in your project root with:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Replace "your_actual_api_key_here" with the API key you copied from Google Cloud Console. 