import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL ? 
    import.meta.env.VITE_SERVER_URL: 'http://localhost:3000'

console.log(serverURL)

const axiosInstance = axios.create({
  baseURL: serverURL,
  timeout: 30000,  // Set a timeout of 30 seconds for requests
  headers: {
    'Content-Type': 'application/json',  // Set the default content type to JSON
    'X-XSRF-TOKEN': 'your-csrf-token',  // Include CSRF token if using CSRF protection
  },
});


// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url) {
      const [path, query] = config.url.split('?');
      if (!path.endsWith('/')) {
        config.url = path + '/' + (query ? '?' + query : '');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;