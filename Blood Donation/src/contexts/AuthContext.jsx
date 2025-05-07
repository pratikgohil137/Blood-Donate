import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage and set user state
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('user');
      
      if (token && userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // Mock login for now - in a real app, this would call an API
      const mockUser = {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'user'
      };
      
      const mockResponse = {
        user: mockUser,
        token: 'mock-jwt-token'
      };
      
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      setUser(mockResponse.user);
      return mockResponse;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Mock logout - in a real app, this would call an API
      // const token = localStorage.getItem('token');
      // if (token) {
      //   await apiLogout(token);
      // }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    try {
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const newUserData = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      // Update state
      setUser(newUserData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 