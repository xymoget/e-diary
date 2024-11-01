import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                // Token expired, refresh it
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/token/refresh/`, {
                refresh: refreshToken,
                });
                token = response.data.access;
                localStorage.setItem('accessToken', token);
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
