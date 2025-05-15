// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function PostProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        // Parse and merge user data with token
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          token
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
  }, []);

  const login = async (responseData) => {
    // Ensure responseData has both user and token
    const userData = {
      ...responseData.user,
      token: responseData.token
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    localStorage.setItem('token', responseData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}