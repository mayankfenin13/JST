import React from 'react';
import styled from 'styled-components';
import { Card, FlexContainer } from '../styles/GlobalStyles';

const MovieCardContainer = styled(Card)`
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

const MovieTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const MovieInfo = styled.div`
  margin-bottom: 16px;
`;

const InfoItem = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  strong {
    color: #333;
    min-width: 80px;
  }
`;

const GenreBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ActionButtons = styled(FlexContainer)`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e1e5e9;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &.edit {
    background: #ffd43b;
    color: #495057;
    
    &:hover {
      background: #fab005;
      transform: translateY(-1px);
    }
  }
  
  &.delete {
    background: #ff6b6b;
    color: white;
    
    &:hover {
      background: #ff5252;
      transform: translateY(-1px);
    }
  }
`;

const YearBadge = styled.span`
  background: #f8f9fa;
  color: #495057;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const MovieCard = ({ movie, onEdit, onDelete }) => {
  return (
    <MovieCardContainer>
      <MovieTitle>{movie.title}</MovieTitle>
      
      <MovieInfo>
        <InfoItem>
          <strong>Director:</strong>
          <span>{movie.director}</span>
        </InfoItem>
        
        <InfoItem>
          <strong>Year:</strong>
          <YearBadge>{movie.releaseYear}</YearBadge>
        </InfoItem>
        
        <InfoItem>
          <strong>Genre:</strong>
          <GenreBadge>{movie.genre}</GenreBadge>
        </InfoItem>
      </MovieInfo>
      
      <ActionButtons gap="8px">
        <ActionButton className="edit" onClick={onEdit}>
          ✏️ Edit
        </ActionButton>
        <ActionButton className="delete" onClick={onDelete}>
          🗑️ Delete
        </ActionButton>
      </ActionButtons>
    </MovieCardContainer>
  );
};

export default MovieCard;