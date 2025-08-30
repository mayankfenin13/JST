import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, FlexContainer } from '../styles/GlobalStyles';

const SearchCard = styled(Card)`
  margin: 20px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

const SearchInput = styled.input`
  flex: 1;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ClearButton = styled.button`
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-1px);
  }
`;

const SearchHint = styled.p`
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
      setIsSearching(false);
    }, 500);

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
            {isSearching ? '⏳' : '🔍 Search'}
          </SearchButton>
        </FlexContainer>
      </form>
      
      <SearchHint>
        💡 You can search by movie title or director name
      </SearchHint>
    </SearchCard>
  );
};

export default SearchBar;