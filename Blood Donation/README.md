# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Setting Up

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

## API Keys

### Google Maps API Key

The application uses Google Maps API for reverse geocoding to automatically detect user's district and state for filtering blood donation hospitals.

To set up your Google Maps API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Create an API key and enable the "Geocoding API"
5. Set the API key in one of these ways:
   - Create a `.env` file in the root directory with `REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`
   - Or directly set it in the `src/config.js` file (not recommended for production)

Without a valid API key, the app will fall back to OpenStreetMap's Nominatim service, which may be less accurate for district-level information in India.

### Detailed Google Maps API Setup Documentation

We've created detailed documentation to help you set up your Google Maps API key:

- **[Google Maps API Key Setup Guide](docs/GoogleMapsAPISetup.md)** - Comprehensive guide with all details
- **[Quick API Key Guide](docs/QuickAPIKeyGuide.md)** - 5-minute setup process
- **[Environment File Setup](docs/EnvFileSetup.md)** - How to properly configure your .env file
- **[Visual UI Guide](docs/GoogleAPIKeyVisualGuide.md)** - Help navigating the Google Cloud Console UI

These guides explain how to:
- Create a Google Cloud project
- Enable the necessary APIs
- Generate and secure your API key
- Set up the free tier ($200 monthly credit)
- Add the API key to your project

The Google Maps API has a generous free tier that should be sufficient for most development and small production needs.
