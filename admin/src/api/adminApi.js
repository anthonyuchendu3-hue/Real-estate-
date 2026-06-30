import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    console.log('🔑 Sending request to:', config.url);
    console.log('🔑 Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Authorization header set');
    } else {
      console.log('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle 401 responses
adminApi.interceptors.response.use(
  (response) => {
    console.log('✅ Response successful:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.config?.url);
    
    if (error.response?.status === 401) {
      console.log('🔑 Token expired or invalid, redirecting to login...');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;