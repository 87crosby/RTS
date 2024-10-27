import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with email and password inputs', () => {
    renderLogin();
    
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockToken = 'mock-jwt-token';
    axios.post.mockResolvedValueOnce({ data: { token: mockToken } });

    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on login failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Login failed'));

    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument();
    });
  });

  test('validates required fields', async () => {
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    expect(emailInput).toBeInvalid();
  });

  test('validates email format', async () => {
    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    expect(emailInput).toBeInvalid();
  });
});