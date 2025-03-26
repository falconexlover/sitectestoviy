import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
`;

const ErrorCode = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 10rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
  line-height: 1;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: #e74c3c;
    bottom: 30px;
    left: 0;
    transform: skewX(-20deg);
  }
`;

const ErrorTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 1.5rem 0;
  color: #2c3e50;
`;

const ErrorDescription = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const LinkGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryLink = styled(Link)`
  display: inline-block;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #219653;
  }
`;

const SecondaryLink = styled(Link)`
  display: inline-block;
  background-color: #f0f0f0;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Illustration = styled.div`
  margin: 1rem 0 2rem;
  font-size: 5rem;
  line-height: 1;
  color: #e74c3c;

  i {
    animation: shake 1.5s infinite;
    display: inline-block;
  }

  @keyframes shake {
    0% {
      transform: rotate(0);
    }
    15% {
      transform: rotate(5deg);
    }
    30% {
      transform: rotate(-5deg);
    }
    45% {
      transform: rotate(4deg);
    }
    60% {
      transform: rotate(-4deg);
    }
    75% {
      transform: rotate(2deg);
    }
    85% {
      transform: rotate(-2deg);
    }
    92% {
      transform: rotate(1deg);
    }
    100% {
      transform: rotate(0);
    }
  }
`;

const NotFoundPage = () => {
  return (
    <PageContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Страница не найдена</ErrorTitle>
      <Illustration>
        <i className="fas fa-tree"></i>
      </Illustration>
      <ErrorDescription>
        Похоже, вы забрели в дремучий лес! Страница, которую вы ищете, не существует или была
        перемещена. Возможно, вы ошиблись при вводе адреса или перешли по устаревшей ссылке.
      </ErrorDescription>
      <LinkGroup>
        <PrimaryLink to="/">Вернуться на главную</PrimaryLink>
        <SecondaryLink to="/rooms">Просмотреть номера</SecondaryLink>
        <SecondaryLink to="/contact">Связаться с нами</SecondaryLink>
      </LinkGroup>
    </PageContainer>
  );
};

export default NotFoundPage;
