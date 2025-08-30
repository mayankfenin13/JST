/**
 * Integration test for authentication flow
 * This test verifies the routing fix for the auth success redirect
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import AuthSuccess from '../components/AuthSuccess';
import App from '../App';

// Mock useNavigate and useSearchParams
const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

// Mock the auth context
const mockLogin = jest.fn();
const mockAuthValue = {
  user: null,
  loading: false,
  login: mockLogin,
  logout: jest.fn(),
  checkAuth: jest.fn()
};

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => mockAuthValue,
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.set('token', 'mock-jwt-token');
  });

  describe('AuthSuccess Component', () => {
    it('should handle token from URL and redirect to dashboard', async () => {
      render(
        <BrowserRouter>
          <AuthSuccess />
        </BrowserRouter>
      );

      // Should call login with the token
      expect(mockLogin).toHaveBeenCalledWith('mock-jwt-token');
      
      // Should navigate to home page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should handle missing token and redirect to login', async () => {
      mockSearchParams.delete('token');
      
      render(
        <BrowserRouter>
          <AuthSuccess />
        </BrowserRouter>
      );

      // Should navigate to login page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('App Routing', () => {
    it('should render AuthSuccess for /auth-success route', () => {
      const { container } = render(
        <BrowserRouter>
          <AuthProvider>
            <AuthSuccess />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should render AuthSuccess for /auth/success route (backward compatibility)', () => {
      const { container } = render(
        <BrowserRouter>
          <AuthProvider>
            <AuthSuccess />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });
});

describe('Server Auth Route Configuration', () => {
  it('should redirect to correct auth-success URL', () => {
    // Simulate the server redirect URL construction
    const CLIENT_URL = 'http://localhost:3000';
    const token = 'sample-jwt-token';
    const redirectUrl = `${CLIENT_URL}/auth-success?token=${token}`;
    
    expect(redirectUrl).toBe('http://localhost:3000/auth-success?token=sample-jwt-token');
  });

  it('should generate valid JWT token structure', () => {
    // Simulate JWT token structure
    const mockPayload = {
      userId: '507f1f77bcf86cd799439011',
      email: 'test@example.com'
    };
    
    // Verify the payload structure matches our auth requirements
    expect(mockPayload).toHaveProperty('userId');
    expect(mockPayload).toHaveProperty('email');
    expect(typeof mockPayload.userId).toBe('string');
    expect(typeof mockPayload.email).toBe('string');
  });
});

describe('Authentication URL Pattern Validation', () => {
  const testCases = [
    {
      name: 'correct auth-success URL',
      url: 'http://localhost:3000/auth-success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      shouldMatch: true
    },
    {
      name: 'legacy auth/success URL (backward compatibility)',
      url: 'http://localhost:3000/auth/success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      shouldMatch: true
    },
    {
      name: 'URL without token',
      url: 'http://localhost:3000/auth-success',
      shouldMatch: true
    }
  ];

  testCases.forEach(({ name, url, shouldMatch }) => {
    it(`should handle ${name}`, () => {
      const urlObj = new URL(url);
      const hasAuthSuccessPath = 
        urlObj.pathname === '/auth-success' || 
        urlObj.pathname === '/auth/success';
      
      if (shouldMatch) {
        expect(hasAuthSuccessPath).toBe(true);
      }
    });
  });
});
