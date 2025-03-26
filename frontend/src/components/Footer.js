import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--dark-color);
  color: white;
  padding: 3rem 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  margin-bottom: 1.5rem;
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: white;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: var(--accent-color);
  }
`;

const FooterNav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterNavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: #bbb;
  text-decoration: none;
  transition: var(--transition);
  display: inline-block;

  &:hover {
    color: white;
    padding-left: 5px;
  }
`;

const FooterText = styled.p`
  color: #bbb;
  margin-bottom: 0.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  font-size: 1.2rem;

  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-3px);
  }
`;

const FooterContact = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContactIcon = styled.div`
  margin-right: 10px;
  color: var(--accent-color);
  font-size: 1.2rem;
  margin-top: 3px;
`;

const ContactInfo = styled.div`
  line-height: 1.6;
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.5rem 0;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #bbb;
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>О нас</FooterTitle>
          <FooterText>
            Гостиничный комплекс "Лесной Дворик" расположен в живописном месте, окруженном сосновым
            лесом. Мы предлагаем комфортный отдых в уютных номерах с современными удобствами.
          </FooterText>
          <SocialLinks>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </SocialIcon>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </SocialIcon>
            <SocialIcon href="https://vk.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-vk"></i>
            </SocialIcon>
            <SocialIcon href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-telegram-plane"></i>
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Навигация</FooterTitle>
          <FooterNav>
            <FooterNavItem>
              <FooterLink to="/">Главная</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/rooms">Номера</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/services">Услуги</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/gallery">Галерея</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/about">О нас</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/contacts">Контакты</FooterLink>
            </FooterNavItem>
          </FooterNav>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Информация</FooterTitle>
          <FooterNav>
            <FooterNavItem>
              <FooterLink to="/booking">Бронирование</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/faq">Частые вопросы</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/terms">Условия проживания</FooterLink>
            </FooterNavItem>
            <FooterNavItem>
              <FooterLink to="/privacy">Политика конфиденциальности</FooterLink>
            </FooterNavItem>
          </FooterNav>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Контакты</FooterTitle>
          <FooterContact>
            <ContactIcon>
              <i className="fas fa-map-marker-alt"></i>
            </ContactIcon>
            <ContactInfo>
              <p>ул. Нижегородская, д. 4,</p>
              <p>г. Жуковский, Московская область, 140180</p>
            </ContactInfo>
          </FooterContact>

          <FooterContact>
            <ContactIcon>
              <i className="fas fa-phone-alt"></i>
            </ContactIcon>
            <ContactInfo>
              <p>+7 (498) 483-19-41</p>
            </ContactInfo>
          </FooterContact>

          <FooterContact>
            <ContactIcon>
              <i className="fas fa-envelope"></i>
            </ContactIcon>
            <ContactInfo>
              <p>info@lesnoy-dvorik.ru</p>
            </ContactInfo>
          </FooterContact>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {currentYear} Гостиничный комплекс "Лесной Дворик" | Все права защищены
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
