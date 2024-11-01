// src/services/authService.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use the default import

const API_URL = 'http://localhost:8000/api'; // Update with your backend URL

const AuthService = {
    login: async (username, password) => {
        const response = await axios.post(`${API_URL}/token/`, { username, password });
        if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    getCurrentUser: () => {
        try {
            const token = localStorage.getItem('accessToken');
            const decodedToken = jwtDecode(token);
            return decodedToken;
        } catch (error) {
            return null;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        const decoded = jwtDecode(token);
        const exp = decoded.exp * 1000;
        return Date.now() < exp;
    },
};

export default AuthService;
