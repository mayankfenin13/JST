import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Container, FlexContainer } from '../styles/GlobalStyles';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <HeaderContainer>
      <Container>
        <FlexContainer justify="space-between">
          <Logo>
            🎬 Movie Collection
          </Logo>
          
          <UserInfo>
            {user?.avatar && (
              <UserAvatar src={user.avatar} alt={user.name} />
            )}
            <UserName>{user?.name}</UserName>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </UserInfo>
        </FlexContainer>
      </Container>
    </HeaderContainer>
  );
};

export default Header;