import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(AuthService.getCurrentUser());

    useEffect(() => {
        // Optionally, handle token refresh logic here
    }, []);

    const login = async (username, password) => {
        await AuthService.login(username, password);
        setUser(AuthService.getCurrentUser());
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}