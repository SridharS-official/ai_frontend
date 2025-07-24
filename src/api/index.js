import axios from 'axios';

// Create an Axios instance with a base URL for your backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Your backend URL
});

// Use an interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;