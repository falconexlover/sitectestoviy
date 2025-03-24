import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Layout = () => {
  return (
    <MainContainer>
      <Header />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      <Footer />
    </MainContainer>
  );
};

export default Layout; 