import React from 'react';
import styled from 'styled-components';
import { Container, Card, Title, Text } from '../styles/GlobalStyles';
import apiConfig from '../config/api';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

const GoogleButton = styled.button`
  background: #4285f4;
  color: white;
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  
  &:hover {
    background: #3367d6;
  }
`;

const GoogleIcon = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4285f4;
`;

const FeatureList = styled.div`
  margin: 24px 0;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
  color: #666;
  
  &::before {
    content: "✓";
    color: #51cf66;
    font-weight: bold;
    margin-right: 12px;
    font-size: 18px;
  }
`;

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = apiConfig.endpoints.auth.google;
  };

  return (
    <LoginContainer>
      <Container>
        <LoginCard>
          <Title style={{ color: '#333', fontSize: '2rem' }}>
            🎬 Movie Collection
          </Title>
          <Text color="#666" style={{ fontSize: '18px', marginBottom: '24px' }}>
            Organize and manage your favorite movies in one place
          </Text>
          
          <FeatureList>
            <FeatureItem>Add and organize your movie collection</FeatureItem>
            <FeatureItem>Search by title or director</FeatureItem>
            <FeatureItem>Edit and update movie details</FeatureItem>
            <FeatureItem>Secure Google authentication</FeatureItem>
          </FeatureList>
          
          <GoogleButton onClick={handleGoogleLogin}>
            <GoogleIcon>G</GoogleIcon>
            Continue with Google
          </GoogleButton>
          
          <Text style={{ marginTop: '24px', fontSize: '14px' }}>
            Sign in to access your personal movie collection
          </Text>
        </LoginCard>
      </Container>
    </LoginContainer>
  );
};

export default Login;