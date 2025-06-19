export const handleAutoLogout = (setIsLoggedIn) => {
  localStorage.removeItem('authToken');
  setIsLoggedIn(false);
  window.location.href = '/';
};

// 2. Create an Axios interceptor to handle token expiration globally
// utils/axiosConfig.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const setupAxiosInterceptors = (setIsLoggedIn) => {
  // Request interceptor to add token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is expired or invalid
        console.log('Token expired, logging out...');
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};