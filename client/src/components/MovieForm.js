import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, FlexContainer } from '../styles/GlobalStyles';

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const FormCard = styled(Card)`
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.error {
    border-color: #ff6b6b;
  }
`;

const Select = styled.select`
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  background: white;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ButtonGroup = styled(FlexContainer)`
  margin-top: 32px;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #495057;
    border: 2px solid #e1e5e9;
    
    &:hover {
      background: #e9ecef;
      transform: translateY(-1px);
    }
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const genres = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 
  'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
];

const MovieForm = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    releaseYear: '',
    genre: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        director: movie.director,
        releaseYear: movie.releaseYear,
        genre: movie.genre
      });
    }
  }, [movie]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.director.trim()) {
      newErrors.director = 'Director is required';
    }

    if (!formData.releaseYear) {
      newErrors.releaseYear = 'Release year is required';
    } else if (formData.releaseYear < 1900 || formData.releaseYear > new Date().getFullYear() + 5) {
      newErrors.releaseYear = 'Please enter a valid year';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <FormOverlay onClick={handleOverlayClick}>
      <FormCard>
        <FormTitle>
          {movie ? 'Edit Movie' : 'Add New Movie'}
        </FormTitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Movie Title *</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter movie title"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="director">Director *</Label>
            <Input
              type="text"
              id="director"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              className={errors.director ? 'error' : ''}
              placeholder="Enter director name"
            />
            {errors.director && <ErrorMessage>{errors.director}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="releaseYear">Release Year *</Label>
            <Input
              type="number"
              id="releaseYear"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              className={errors.releaseYear ? 'error' : ''}
              placeholder="Enter release year"
              min="1900"
              max={new Date().getFullYear() + 5}
            />
            {errors.releaseYear && <ErrorMessage>{errors.releaseYear}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="genre">Genre *</Label>
            <Select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Select>
            {errors.genre && <ErrorMessage>{errors.genre}</ErrorMessage>}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (movie ? 'Update Movie' : 'Add Movie')}
            </Button>
          </ButtonGroup>
        </form>
      </FormCard>
    </FormOverlay>
  );
};

export default MovieForm;