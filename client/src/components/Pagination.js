import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../styles/GlobalStyles';

const PaginationContainer = styled.div`
  margin: 40px 0;
  display: flex;
  justify-content: center;
`;

const PaginationButton = styled.button`
  background: ${props => props.active ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'rgba(255, 255, 255, 0.9)'
  };
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e1e5e9'};
  border-radius: 8px;
  padding: 10px 16px;
  margin: 0 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 44px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => props.active ? 
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
      '#f8f9fa'
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PageInfo = styled.div`
  color: white;
  font-size: 14px;
  margin: 0 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <PaginationContainer>
      <FlexContainer align="center">
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Prev
        </PaginationButton>

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{ color: 'white', margin: '0 8px' }}>...</span>
            ) : (
              <PaginationButton
                active={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationButton>
            )}
          </React.Fragment>
        ))}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </PaginationButton>

        <PageInfo>
          Page {currentPage} of {totalPages}
        </PageInfo>
      </FlexContainer>
    </PaginationContainer>
  );
};

export default Pagination;