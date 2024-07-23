import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/check-auth', { withCredentials: true });
        console.log("auth response ",response);
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(response.data.name);
          setIsAdmin(response.data.isAdmin);
        } else {
          setIsAuthenticated(false);
          setUsername('');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        setUsername('');
        setIsAdmin(false);
      }
      
    };

    // Checking auth status on mount
    checkAuth();

    // Setting interval to periodically check auth status
    const interval = setInterval(checkAuth, 600000); // Check every 10 minutes

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const login = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const signup = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,isAdmin,username,signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
