import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

// Основной контейнер шапки
const HeaderContainer = styled.header`
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);

  &.scrolled {
    box-shadow: var(--shadow-md);
  }
`;

// Контейнер для логотипа и контактов
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Логотип
const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: var(--accent-color);
  }
`;

// Контактная информация
const HeaderContact = styled.div`
  text-align: right;
  font-size: 0.9rem;

  p:first-child {
    font-weight: 600;
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Навигация
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// Список навигационных ссылок
const NavLinks = styled.ul`
  display: flex;
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => (props.isOpen ? '0' : '-100%')};
    width: 80%;
    height: 100vh;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    flex-direction: column;
    justify-content: center;
    padding-top: 60px;
    transition: all 0.4s ease;
    z-index: 99;
    box-shadow: var(--shadow-lg);
  }
`;

// Элемент списка
const NavItem = styled.li`
  position: relative;

  @media (max-width: 768px) {
    text-align: center;
    margin: 1rem 0;
  }
`;

// Навигационная ссылка
const NavLink = styled(Link)`
  display: block;
  padding: 1.2rem 1.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  transition: var(--transition);
  text-transform: uppercase;
  position: relative;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: white;
    transform: translateX(-50%);
    transition: var(--transition);
  }

  &:hover::after {
    width: 30px;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    width: 100%;
  }
`;

// Кнопка бронирования
const BookButton = styled(Link)`
  background-color: white;
  color: var(--primary-color);
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: none;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    background-color: var(--accent-color);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Кнопка мобильного меню
const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  position: relative;
  cursor: pointer;
  z-index: 100;

  span {
    display: block;
    width: 30px;
    height: 3px;
    background-color: white;
    margin: 6px auto;
    transition: all 0.3s ease;
  }

  &.open {
    span:nth-child(1) {
      transform: rotate(45deg) translate(7px, 7px);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderContainer className={isScrolled ? 'scrolled' : ''}>
      <LogoContainer>
        <Logo to="/">Лесной Дворик</Logo>
        <HeaderContact>
          <p>Забронировать номер:</p>
          <p>+7 (999) 123-45-67</p>
        </HeaderContact>
      </LogoContainer>

      <Nav>
        <NavLinks isOpen={isMobileMenuOpen}>
          <NavItem>
            <NavLink to="/" onClick={closeMobileMenu}>
              Главная
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/rooms" onClick={closeMobileMenu}>
              Номера
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/services" onClick={closeMobileMenu}>
              Услуги
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/gallery" onClick={closeMobileMenu}>
              Галерея
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about" onClick={closeMobileMenu}>
              О нас
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contact" onClick={closeMobileMenu}>
              Контакты
            </NavLink>
          </NavItem>
          {isAuthenticated ? (
            <>
              <NavItem>
                <NavLink to="/profile" onClick={closeMobileMenu}>
                  Профиль
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/bookings" onClick={closeMobileMenu}>
                  Мои бронирования
                </NavLink>
              </NavItem>
              {user?.role === 'admin' && (
                <NavItem>
                  <NavLink to="/admin/dashboard" onClick={closeMobileMenu}>
                    Админ панель
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink
                  to="/"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  Выход
                </NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/login" onClick={closeMobileMenu}>
                  Вход
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/register" onClick={closeMobileMenu}>
                  Регистрация
                </NavLink>
              </NavItem>
            </>
          )}
        </NavLinks>
        <BookButton to="/rooms">Забронировать</BookButton>
        <MobileMenuButton
          className={isMobileMenuOpen ? 'open' : ''}
          onClick={toggleMobileMenu}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
