import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed' 
    };
  }
};

export const getStockPrice = async (symbol, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/stock/${symbol}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch stock price' 
    };
  }
};