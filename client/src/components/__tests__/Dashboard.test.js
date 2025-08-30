import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../context/AuthContext';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify');
jest.mock('../Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../MovieCard', () => ({ movie, onEdit, onDelete }) => (
  <div data-testid={`movie-${movie._id}`}>
    <span>{movie.title}</span>
    <button onClick={onEdit}>Edit</button>
    <button onClick={() => onDelete(movie._id)}>Delete</button>
  </div>
));
jest.mock('../MovieForm', () => ({ onSubmit, onCancel, movie }) => (
  <div data-testid="movie-form">
    <button onClick={() => onSubmit({ title: 'New Movie', director: 'Director', releaseYear: 2023, genre: 'Action' })}>
      Submit
    </button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));
jest.mock('../SearchBar', () => ({ onSearch }) => (
  <input
    data-testid="search-bar"
    onChange={(e) => onSearch(e.target.value)}
    placeholder="Search..."
  />
));
jest.mock('../Pagination', () => ({ currentPage, totalPages, onPageChange }) => (
  <div data-testid="pagination">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
      Previous
    </button>
    <span>Page {currentPage} of {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>
));

const mockUser = {
  _id: '123',
  name: 'Test User',
  email: 'test@example.com'
};

const mockMovies = [
  {
    _id: '1',
    title: 'Test Movie 1',
    director: 'Director 1',
    releaseYear: 2023,
    genre: 'Action'
  },
  {
    _id: '2',
    title: 'Test Movie 2',
    director: 'Director 2',
    releaseYear: 2022,
    genre: 'Drama'
  }
];

const MockAuthProvider = ({ children }) => {
  const mockAuthValue = {
    user: mockUser,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    checkAuth: jest.fn()
  };

  return (
    <AuthProvider value={mockAuthValue}>
      {children}
    </AuthProvider>
  );
};

const renderWithAuth = (component) => {
  return render(
    <MockAuthProvider>
      {component}
    </MockAuthProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({
      data: {
        movies: mockMovies,
        totalPages: 1,
        total: 2
      }
    });
  });

  it('renders dashboard with header and title', async () => {
    renderWithAuth(<Dashboard />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Your Movie Collection')).toBeInTheDocument();
    expect(screen.getByText('+ Add Movie')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithAuth(<Dashboard />);
    
    expect(screen.getByText('Loading movies...')).toBeInTheDocument();
  });

  it('fetches and displays movies', async () => {
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('movie-1')).toBeInTheDocument();
      expect(screen.getByTestId('movie-2')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('displays statistics correctly', async () => {
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total movies
    });
    
    // Should display unique genres and directors
    expect(screen.getByText('Total Movies')).toBeInTheDocument();
    expect(screen.getByText('Unique Genres')).toBeInTheDocument();
    expect(screen.getByText('Directors')).toBeInTheDocument();
  });

  it('opens add movie form when add button is clicked', async () => {
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('movie-1')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add Movie');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('movie-form')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'Test' } });
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/movies', {
        params: {
          search: 'Test',
          page: 1,
          limit: 12
        }
      });
    });
  });

  it('handles movie deletion', async () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
    axios.delete.mockResolvedValue({});
    
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('movie-1')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this movie?');
    expect(axios.delete).toHaveBeenCalledWith('/api/movies/1');
  });

  it('displays no movies message when collection is empty', async () => {
    axios.get.mockResolvedValue({
      data: {
        movies: [],
        totalPages: 0,
        total: 0
      }
    });
    
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No movies in your collection yet')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Start building your collection by adding your first movie!')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error loading movies');
    });
  });

  it('handles movie form submission', async () => {
    axios.post.mockResolvedValue({
      data: { _id: '3', title: 'New Movie' }
    });
    
    renderWithAuth(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('+ Add Movie')).toBeInTheDocument();
    });

    // Open form
    const addButton = screen.getByText('+ Add Movie');
    fireEvent.click(addButton);
    
    // Submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/movies', {
        title: 'New Movie',
        director: 'Director',
        releaseYear: 2023,
        genre: 'Action'
      });
    });
    
    expect(toast.success).toHaveBeenCalledWith('Movie added successfully!');
  });
});
