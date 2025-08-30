// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      google: `${API_BASE_URL}/api/auth/google`,
      logout: `${API_BASE_URL}/api/auth/logout`,
      verify: `${API_BASE_URL}/api/auth/verify`,
    },
    movies: {
      base: `${API_BASE_URL}/api/movies`,
    },
    health: `${API_BASE_URL}/api/health`,
  }
};

export default apiConfig;
