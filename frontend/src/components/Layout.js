import React from 'react';
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
  width: 100%;
`;

const Layout = ({ children }) => {
  return (
    <MainContainer>
      <Header />
      <ContentContainer>
        {children}
      </ContentContainer>
      <Footer />
    </MainContainer>
  );
};

export default Layout;
