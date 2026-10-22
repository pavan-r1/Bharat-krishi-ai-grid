import axios from 'axios';

// Base URL configured via environment or default to FastAPI local server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Configuration flag to check if mock data mode is enabled
export const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for logging & token injection when connected to real backend
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('bkig_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Non-sensitive request logging in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with user-friendly error normalization
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected network error occurred.';
    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || `Error ${error.response.status}: Server request failed`;
    } else if (error.request) {
      message = 'Unable to connect to BKIG backend server. Please verify the backend is running.';
    }
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status ?? null;
    normalizedError.code = error.code;
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
