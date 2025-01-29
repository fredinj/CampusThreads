import axios from 'axios';

const serverURL = import.meta.env.PROD 
  ? import.meta.env.VITE_SERVER_URL 
  : 'http://localhost:3000'


const axiosInstance = axios.create({
  baseURL: serverURL,
  timeout: 30000,  // Set a timeout of 30 seconds for requests
  headers: {
    'Content-Type': 'application/json',  // Set the default content type to JSON
    'X-XSRF-TOKEN': 'your-csrf-token',  // Include CSRF token if using CSRF protection
  },
});

export default axiosInstance;