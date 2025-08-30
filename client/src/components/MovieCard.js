import React from 'react';
import styled from 'styled-components';
import { Card, FlexContainer } from '../styles/GlobalStyles';

const MovieCardContainer = styled(Card)`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MovieTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  
  span:first-child {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 500;
    min-width: 60px;
  }
  
  span:last-child {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
`;

const GenreBadge = styled.span`
  background: rgba(120, 119, 198, 0.2);
  color: rgba(120, 119, 198, 1);
  border: 1px solid rgba(120, 119, 198, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
`;

const YearBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButtons = styled(FlexContainer)`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &.edit {
    background: rgba(255, 193, 7, 0.15);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
    
    &:hover:not(:disabled) {
      background: rgba(255, 193, 7, 0.25);
      border-color: rgba(255, 193, 7, 0.5);
      box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
    }
  }
  
  &.delete {
    background: rgba(220, 53, 69, 0.15);
    color: #dc3545;
    border: 1px solid rgba(220, 53, 69, 0.3);
    
    &:hover:not(:disabled) {
      background: rgba(220, 53, 69, 0.25);
      border-color: rgba(220, 53, 69, 0.5);
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
    }
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const MovieCard = ({ movie, onEdit, onDelete }) => {
  return (
    <MovieCardContainer>
      <MovieTitle>{movie.title}</MovieTitle>
      
      <MovieInfo>
        <InfoRow>
          <span>Director</span>
          <span>{movie.director}</span>
        </InfoRow>
        
        <InfoRow>
          <span>Year</span>
          <YearBadge>{movie.releaseYear}</YearBadge>
        </InfoRow>
        
        <InfoRow>
          <span>Genre</span>
          <GenreBadge>{movie.genre}</GenreBadge>
        </InfoRow>
      </MovieInfo>
      
      <ActionButtons gap="12px">
        <ActionButton 
          className="edit" 
          onClick={onEdit}
          title="Edit movie"
        >
          Edit
        </ActionButton>
        <ActionButton 
          className="delete" 
          onClick={onDelete}
          title="Delete movie"
        >
          Delete
        </ActionButton>
      </ActionButtons>
    </MovieCardContainer>
  );
};

export default MovieCard;