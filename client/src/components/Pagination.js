import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../styles/GlobalStyles';

const PaginationContainer = styled.div`
  margin: 48px 0;
  display: flex;
  justify-content: center;
`;

const PaginationButton = styled.button`
  background: ${props => props.active ? 
    'rgba(120, 119, 198, 0.2)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.active ? 'rgba(120, 119, 198, 1)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.active ? 
    'rgba(120, 119, 198, 0.4)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 10px;
  padding: 12px 16px;
  margin: 0 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 44px;
  backdrop-filter: blur(20px);
  letter-spacing: 0.02em;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${props => props.active ? 
      'rgba(120, 119, 198, 0.3)' : 
      'rgba(255, 255, 255, 0.1)'
    };
    border-color: ${props => props.active ? 
      'rgba(120, 119, 198, 0.6)' : 
      'rgba(255, 255, 255, 0.2)'
    };
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    color: ${props => props.active ? 'rgba(120, 119, 198, 1)' : 'rgba(255, 255, 255, 0.9)'};
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
    color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
  }
`;

const PageInfo = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  font-weight: 400;
  letter-spacing: 0.02em;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
  backdrop-filter: blur(20px);
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
          Previous
        </PaginationButton>

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                margin: '0 12px',
                fontSize: '14px',
                fontWeight: '500'
              }}>...</span>
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
          Next
        </PaginationButton>

        <PageInfo>
          Page {currentPage} of {totalPages}
        </PageInfo>
      </FlexContainer>
    </PaginationContainer>
  );
};

export default Pagination;