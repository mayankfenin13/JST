import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock axios
jest.mock('axios');

// Test component to use the auth context
const TestComponent = () => {
  const { user, loading, login, logout, checkAuth } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <button onClick={() => login('test-token')} data-testid="login-btn">Login</button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
      <button onClick={checkAuth} data-testid="check-auth-btn">Check Auth</button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
  });

  it('provides auth context values', () => {
    axios.get.mockRejectedValue(new Error('No token'));
    
    renderWithAuthProvider();
    
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
    expect(screen.getByTestId('check-auth-btn')).toBeInTheDocument();
  });

  it('checks authentication on mount with valid token', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('token', 'valid-token');
    axios.get.mockResolvedValue({ data: mockUser });
    
    renderWithAuthProvider();
    
    // Initially loading
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });
    
    expect(axios.get).toHaveBeenCalledWith('/api/auth/user');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer valid-token');
  });

  it('handles authentication failure on mount', async () => {
    localStorage.setItem('token', 'invalid-token');
    axios.get.mockRejectedValue(new Error('Invalid token'));
    
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });

  it('handles login successfully', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    axios.get.mockResolvedValue({ data: mockUser });
    
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
    
    const loginBtn = screen.getByTestId('login-btn');
    
    await act(async () => {
      loginBtn.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });
    
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
  });

  it('handles logout successfully', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('token', 'valid-token');
    axios.get.mockResolvedValue({ data: mockUser });
    axios.post.mockResolvedValue({});
    
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });
    
    const logoutBtn = screen.getByTestId('logout-btn');
    
    await act(async () => {
      logoutBtn.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
    
    expect(axios.post).toHaveBeenCalledWith('/api/auth/logout');
    expect(localStorage.getItem('token')).toBeNull();
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });

  it('handles logout with API error', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('token', 'valid-token');
    axios.get.mockResolvedValue({ data: mockUser });
    axios.post.mockRejectedValue(new Error('Logout failed'));
    
    renderWithAuthProvider();
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });
    
    const logoutBtn = screen.getByTestId('logout-btn');
    
    await act(async () => {
      logoutBtn.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
    
    // Should still clear local state even if API call fails
    expect(localStorage.getItem('token')).toBeNull();
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });

  it('sets axios authorization header when token exists in localStorage', () => {
    localStorage.setItem('token', 'existing-token');
    axios.get.mockRejectedValue(new Error('Invalid token'));
    
    renderWithAuthProvider();
    
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer existing-token');
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
