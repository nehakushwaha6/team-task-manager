import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Axios instance
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', 
  });

  // Interceptor to add token to requests
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username'
    formData.append('password', password);

    // Using the 'api' instance here so it uses the correct baseURL
    const res = await api.post('/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const newToken = res.data.access_token;
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const signup = async (name, email, password, role) => {
    // Using the 'api' instance here so it uses the correct baseURL
    await api.post('/signup', {
      name, email, password, role
    });
    // Auto login after signup
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
