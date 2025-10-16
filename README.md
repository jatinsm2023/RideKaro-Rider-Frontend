# Ride Karo - React Native App

A React Native application with authentication using access tokens and refresh tokens.

## Project Structure

```
my-expo-app/
├── components/
│   └── Pages/
│       ├── Login.jsx          # Login/Register page
│       └── Dashboard.jsx      # Main dashboard after login
├── contexts/
│   └── AuthContext.jsx        # Authentication context
├── utils/
│   └── api.js                 # API utility functions
├── App.jsx                    # Main app component
├── main.jsx                   # Entry point component
└── package.json
```

## Features

- **Authentication**: Login and registration with JWT tokens
- **Token Management**: Access tokens and refresh tokens with AsyncStorage
- **Auto Token Refresh**: Automatic token refresh when access token expires
- **Context API**: Global authentication state management
- **JSX Support**: Converted from TypeScript to JavaScript

## API Integration

The app connects to a Node.js backend with the following endpoints:
- `POST /v0/users/login` - User login
- `POST /v0/users/create` - User registration  
- `POST /v0/users/refresh-token` - Token refresh

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the API_BASE_URL in `utils/api.js` to match your backend URL

3. Start the development server:
```bash
npm start
```

## Authentication Flow

1. User enters credentials on Login page
2. App calls backend login API
3. Backend returns access token and refresh token
4. Tokens are stored in AsyncStorage
5. User is redirected to Dashboard
6. App automatically refreshes tokens when needed
7. User can logout to clear all stored data

## Dependencies

- `@react-native-async-storage/async-storage` - For token storage
- `react-native` - Core React Native
- `expo` - Development platform
# RideKaro-Rider-Frontend
