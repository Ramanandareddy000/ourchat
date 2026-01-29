// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3002',
  ENDPOINTS: {
    USERS: '/users',
    MESSAGES: '/messages',
    AUTH: '/auth'
  }
};