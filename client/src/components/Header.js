import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Container, FlexContainer } from '../styles/GlobalStyles';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.02em;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, rgba(120, 119, 198, 1), rgba(255, 119, 198, 1));
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(120, 119, 198, 0.5);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const UserAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
`;

const LogoutButton = styled.button`
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(220, 53, 69, 0.25);
    border-color: rgba(220, 53, 69, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
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
            Movie Collection
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