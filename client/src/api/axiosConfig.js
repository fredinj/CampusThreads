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
    if (config.url) {
      const [path, query] = config.url.split('?');
      if (!path.endsWith('/')) {
        config.url = path + '/' + (query ? '?' + query : '');
      }
    }

    // Public endpoints to not send auth headers to
    const publicEndpoints = [
      '/api/auth/login/',
      '/api/auth/signup/',
      '/api/auth/verify-email/',
    ];
    
    // Check if the current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );

    if(!isPublicEndpoint){
        const token = localStorage.getItem('access');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;