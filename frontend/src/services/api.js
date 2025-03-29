import axios from 'axios';

// Use environment variable for API URL with production fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://codebyced-production.up.railway.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;