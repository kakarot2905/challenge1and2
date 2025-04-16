# Target Account Matching System

This project consists of two main components:

1. A RESTful API service for account matching
2. A Chrome extension for LinkedIn profile enhancement

## Backend API Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with:

```
JWT_SECRET=your-secret-key
PORT=3000
```

3. Start the server:

```bash
npm start
```

### API Endpoints

- `POST /login` - Login with username and password
- `GET /accounts` - Get list of companies with match scores
- `POST /accounts/:id/status` - Update company target status

## Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension directory

### Features

- Displays company information in a floating widget
- Shows match score with a progress bar
- Indicates account status with color-coded tags
- Toggle widget visibility with the extension popup

### Default Credentials

For testing the API:

- Username: user1
- Password: pass123

## Development

- Backend uses Express.js with JWT authentication
- Chrome extension uses vanilla JavaScript
- All data is currently stored in memory (replace with a database for production)

## Security Notes

- Replace the default JWT secret in production
- Implement proper password hashing
- Add rate limiting for API endpoints
- Use a secure database for user and company data
