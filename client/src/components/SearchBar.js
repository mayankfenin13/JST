import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, FlexContainer } from '../styles/GlobalStyles';

const SearchCard = styled(Card)`
  margin: 32px 0;
`;

const SearchInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 15px;
  color: #ffffff;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  
  &:focus {
    outline: none;
    border-color: rgba(120, 119, 198, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 1px rgba(120, 119, 198, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SearchButton = styled.button`
  background: rgba(120, 119, 198, 0.15);
  color: rgba(120, 119, 198, 1);
  border: 1px solid rgba(120, 119, 198, 0.3);
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 100px;
  backdrop-filter: blur(20px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover:not(:disabled) {
    background: rgba(120, 119, 198, 0.25);
    border-color: rgba(120, 119, 198, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(120, 119, 198, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
`;

const SearchHint = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
  font-weight: 400;
`;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsSearching(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    setIsSearching(false);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <SearchCard>
      <form onSubmit={handleSearch}>
        <FlexContainer gap="12px" align="center">
          <SearchInput
            type="text"
            placeholder="Search by movie title or director..."
            value={query}
            onChange={handleInputChange}
          />
          
          {query && (
            <ClearButton type="button" onClick={handleClear}>
              Clear
            </ClearButton>
          )}
          
          <SearchButton type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </SearchButton>
        </FlexContainer>
      </form>
      
      <SearchHint>
        Search by movie title or director name
      </SearchHint>
    </SearchCard>
  );
};

export default SearchBar;