# Environment Setup

## Environment Variables

The app uses environment variables for configuration. Create a `.env` file in the root directory:

```bash
# API Configuration
API_BASE_URL=http://localhost:4000/v0/users
```

## Environment Files

- `.env` - Contains environment variables
- `config/api.js` - API configuration using environment variables

## Usage

The API configuration is imported in components:

```javascript
import { getApiUrl, API_CONFIG } from '../../config/api';

// Usage
const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), data);
```

## Changing API URL

To change the API URL, update the `.env` file:

```bash
# For production
API_BASE_URL=https://your-api-domain.com/v0/users

# For local development
API_BASE_URL=http://localhost:4000/v0/users
```

## Babel Configuration

The app is configured to use `react-native-dotenv` for environment variable support in `babel.config.js`.
