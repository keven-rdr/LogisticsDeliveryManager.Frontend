import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor for errors or future auth headers
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling could go here
    return Promise.reject(error);
  }
);

export default api;
