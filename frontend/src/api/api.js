import axios from 'axios';

// Create an Axios instance pointing to our backend API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Pointing to the backend
});

// Add a request interceptor to automatically attach the token if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to headers
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
