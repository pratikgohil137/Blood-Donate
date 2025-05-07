import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your backend URL

// Register a new user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login a user
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Logout a user
export const logout = async (token) => {
  await axios.post(`${API_URL}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Fetch all users (protected route)
export const getUsers = async (token) => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};