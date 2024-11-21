import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  // Base URL for the backend API
  timeout: 30000,  // Set a timeout of 5 seconds for requests
  headers: {
    'Content-Type': 'application/json',  // Set the default content type to JSON
    'X-XSRF-TOKEN': 'your-csrf-token',  // Include CSRF token if using CSRF protection
  },
});

export default axiosInstance;