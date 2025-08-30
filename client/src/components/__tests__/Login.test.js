import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('Login Component', () => {
  it('renders login form with correct elements', () => {
    render(<Login />);
    
    expect(screen.getByText('🎬 Movie Collection')).toBeInTheDocument();
    expect(screen.getByText('Organize and manage your favorite movies in one place')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('displays feature list', () => {
    render(<Login />);
    
    expect(screen.getByText('Add and organize your movie collection')).toBeInTheDocument();
    expect(screen.getByText('Search by title or director')).toBeInTheDocument();
    expect(screen.getByText('Edit and update movie details')).toBeInTheDocument();
    expect(screen.getByText('Secure Google authentication')).toBeInTheDocument();
  });

  it('redirects to Google OAuth when button is clicked', () => {
    render(<Login />);
    
    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);
    
    expect(window.location.href).toBe('http://localhost:5001/api/auth/google');
  });

  it('displays sign in message', () => {
    render(<Login />);
    
    expect(screen.getByText('Sign in to access your personal movie collection')).toBeInTheDocument();
  });
});
