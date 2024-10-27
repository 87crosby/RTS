import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/register`, userData);
  return response.data;
};

export const getStockPrice = async (symbol, token) => {
  const response = await axios.get(`${API_URL}/api/stock/${symbol}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};