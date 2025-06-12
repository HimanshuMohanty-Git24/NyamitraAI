// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081', // Replace with your backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add a timeout for requests
});

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
