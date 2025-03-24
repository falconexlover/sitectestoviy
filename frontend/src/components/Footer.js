import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #003366;
  color: white;
  padding: 2rem;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: white;
  }
`;

const FooterText = styled.p`
  color: #ccc;
  margin: 0.25rem 0;
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  color: #ccc;
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Гостиничный комплекс "Лесной Дворик"</FooterTitle>
          <FooterText>Уютное место для отдыха в окружении природы</FooterText>
          <FooterText>Адрес: ул. Лесная, 1</FooterText>
          <FooterText>Телефон: +7 (123) 456-78-90</FooterText>
          <FooterText>Email: info@lesnoy-dvorik.ru</FooterText>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Навигация</FooterTitle>
          <FooterLink to="/">Главная</FooterLink>
          <FooterLink to="/rooms">Номера</FooterLink>
          <FooterLink to="/login">Вход</FooterLink>
          <FooterLink to="/register">Регистрация</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Информация</FooterTitle>
          <FooterLink to="/about">О нас</FooterLink>
          <FooterLink to="/services">Услуги</FooterLink>
          <FooterLink to="/terms">Условия бронирования</FooterLink>
          <FooterLink to="/privacy">Политика конфиденциальности</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {currentYear} Гостиничный комплекс "Лесной Дворик". Все права защищены.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 