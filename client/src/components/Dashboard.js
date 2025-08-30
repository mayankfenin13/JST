import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Title, Grid } from '../styles/GlobalStyles';
import { Card, Container, FlexContainer } from '../styles/StyledComponents';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import MovieCard from './MovieCard';
import MovieForm from './MovieForm';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 40px;
`;

const StatsCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(81, 207, 102, 0.3);
  }
`;

const NoMoviesMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
  
  h3 {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.8;
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

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, currentPage]);

  const fetchMovies = async () => {
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
  };

  const handleAddMovie = async (movieData) => {
    try {
      const response = await axios.post('/api/movies', movieData);
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
      const response = await axios.put(`/api/movies/${id}`, movieData);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          <Title style={{ margin: 0 }}>Your Movie Collection</Title>
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
            <h3>{new Set(movies.map(m => m.genre)).size}</h3>
            <p>Unique Genres</p>
          </StatsCard>
          <StatsCard>
            <h3>{new Set(movies.map(m => m.director)).size}</h3>
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
            <h3>
              {searchQuery ? 'No movies found' : 'No movies in your collection yet'}
            </h3>
            <p>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start building your collection by adding your first movie!'
              }
            </p>
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