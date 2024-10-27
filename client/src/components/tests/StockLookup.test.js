import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import StockLookup from '../StockLookup';
import { AuthProvider } from '../../context/AuthContext';

// Mock axios
jest.mock('axios');

// Mock AuthContext
const mockToken = 'mock-jwt-token';
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-jwt-token' }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

const renderStockLookup = () => {
  render(
    <AuthProvider>
      <StockLookup />
    </AuthProvider>
  );
};

describe('StockLookup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders stock lookup form', () => {
    renderStockLookup();
    
    expect(screen.getByRole('textbox', { name: /stock symbol/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get price/i })).toBeInTheDocument();
  });

  test('converts input to uppercase', () => {
    renderStockLookup();
    
    const input = screen.getByRole('textbox', { name: /stock symbol/i });
    fireEvent.change(input, { target: { value: 'aapl' } });
    
    expect(input.value).toBe('AAPL');
  });

  test('handles successful stock price lookup', async () => {
    const mockPrice = 150.50;
    axios.get.mockResolvedValueOnce({ 
      data: { openPrice: mockPrice }
    });

    renderStockLookup();

    const input = screen.getByRole('textbox', { name: /stock symbol/i });
    const submitButton = screen.getByRole('button', { name: /get price/i });

    fireEvent.change(input, { target: { value: 'AAPL' } });

    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/stock/AAPL',
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(screen.getByText(`Opening Price: $${mockPrice}`)).toBeInTheDocument();
    });
  });

  test('displays error message on failed lookup', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch stock price'));

    renderStockLookup();

    const input = screen.getByRole('textbox', { name: /stock symbol/i });
    const submitButton = screen.getByRole('button', { name: /get price/i });

    fireEvent.change(input, { target: { value: 'INVALID' } });

    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch stock price')).toBeInTheDocument();
    });
  });
});
