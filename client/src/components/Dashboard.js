import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Title, Grid, Card, Container, FlexContainer } from '../styles/GlobalStyles';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import MovieCard from './MovieCard';
import MovieForm from './MovieForm';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 60px;
`;

const StatsCard = styled(Card)`
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(120, 119, 198, 0.8), 
      rgba(255, 119, 198, 0.8), 
      rgba(120, 219, 255, 0.8)
    );
    border-radius: 16px 16px 0 0;
  }
  
  h3 {
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  
  p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin: 32px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 24px 0;
  }
`;

const AddButton = styled.button`
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(34, 197, 94, 0.25);
    border-color: rgba(34, 197, 94, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
  }
`;

const NoMoviesMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  padding: 80px 20px;
  
  h3 {
    font-size: 24px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  
  p {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/movies', {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: 12
        }
      });
      
      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
      setTotalMovies(response.data.total);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Error loading movies');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleAddMovie = async (movieData) => {
    try {
      await axios.post('/api/movies', movieData);
      toast.success('Movie added successfully!');
      setShowForm(false);
      fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
      toast.error(error.response?.data?.message || 'Error adding movie');
    }
  };

  const handleEditMovie = async (id, movieData) => {
    try {
      await axios.put(`/api/movies/${id}`, movieData);
      toast.success('Movie updated successfully!');
      setEditingMovie(null);
      setShowForm(false);
      fetchMovies();
    } catch (error) {
      console.error('Error updating movie:', error);
      toast.error(error.response?.data?.message || 'Error updating movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`/api/movies/${id}`);
        toast.success('Movie deleted successfully!');
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
        toast.error('Error deleting movie');
      }
    }
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Memoize stats calculations to prevent unnecessary re-renders
  const stats = useMemo(() => {
    const uniqueGenres = new Set(movies.map(m => m.genre)).size;
    const uniqueDirectors = new Set(movies.map(m => m.director)).size;
    return { uniqueGenres, uniqueDirectors };
  }, [movies]);

  // Removed import samples functionality since shared movies are now shown automatically

  const openAddForm = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const openEditForm = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  return (
    <DashboardContainer>
      <Header />
      <Container>
        <FlexContainer justify="space-between" align="center" style={{ margin: '20px 0' }}>
          <Title style={{ margin: 0 }}>Movie Collection</Title>
          <AddButton onClick={openAddForm}>
            + Add Movie
          </AddButton>
        </FlexContainer>

        <StatsGrid>
          <StatsCard>
            <h3>{totalMovies}</h3>
            <p>Total Movies</p>
          </StatsCard>
          <StatsCard>
            <h3>{stats.uniqueGenres}</h3>
            <p>Unique Genres</p>
          </StatsCard>
          <StatsCard>
            <h3>{stats.uniqueDirectors}</h3>
            <p>Directors</p>
          </StatsCard>
        </StatsGrid>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            Loading movies...
          </div>
        ) : movies.length === 0 ? (
          <NoMoviesMessage>
            <h3>No movies found</h3>
            <p>Try adjusting your search terms or check back later for more movies!</p>
          </NoMoviesMessage>
        ) : (
          <>
            <Grid>
              {movies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onEdit={() => openEditForm(movie)}
                  onDelete={() => handleDeleteMovie(movie._id)}
                />
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {showForm && (
          <MovieForm
            movie={editingMovie}
            onSubmit={editingMovie ? 
              (data) => handleEditMovie(editingMovie._id, data) : 
              handleAddMovie
            }
            onCancel={closeForm}
          />
        )}
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;