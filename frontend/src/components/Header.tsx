import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

interface NavLinksProps {
  isOpen: boolean;
}

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
const NavLinks = styled.ul<NavLinksProps>`
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

  &.open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 7px);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -7px);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

// Фон при открытом мобильном меню
const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
`;

// Контейнер для пользовательского меню
const UserMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

// Кнопка пользовательского меню
const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  transition: var(--transition);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 0.5rem;
    object-fit: cover;
  }

  i {
    margin-left: 0.5rem;
  }
`;

// Выпадающее меню
const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  padding: 0.5rem 0;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 99;
`;

// Пункт выпадающего меню
const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);

  i {
    margin-right: 0.75rem;
    color: var(--primary-color);
    width: 20px;
    text-align: center;
  }

  &:hover {
    background-color: var(--light-color);
  }
`;

// Кнопка выхода
const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  font-size: inherit;
  text-align: left;

  i {
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
  }

  &:hover {
    background-color: var(--light-color);
  }
`;

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Добавляем слушатель события прокрутки
    window.addEventListener('scroll', handleScroll);

    // Очищаем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Закрываем выпадающее меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (userMenuOpen && !(event.target as HTMLElement).closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  const toggleUserMenu = (): void => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <HeaderContainer className={scrolled ? 'scrolled' : ''}>
      <LogoContainer>
        <Logo to="/">Лесной Дворик</Logo>
        <HeaderContact>
          <p>Бронирование номеров:</p>
          <p>+7 (498) 483-19-41</p>
        </HeaderContact>
      </LogoContainer>

      <Nav>
        <MobileMenuButton
          className={mobileMenuOpen ? 'open' : ''}
          onClick={toggleMobileMenu}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>

        <NavLinks isOpen={mobileMenuOpen}>
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
            <NavLink to="/contacts" onClick={closeMobileMenu}>
              Контакты
            </NavLink>
          </NavItem>
        </NavLinks>

        {isAuthenticated ? (
          <UserMenuContainer className="user-menu">
            <UserMenuButton onClick={toggleUserMenu}>
              <img
                src={user?.avatar || '/images/default-avatar.png'}
                alt={user?.name || 'Аватар пользователя'}
              />
              <span>{user?.name}</span>
              <i className="fas fa-chevron-down"></i>
            </UserMenuButton>
            <DropdownMenu isOpen={userMenuOpen}>
              <DropdownItem to="/profile">
                <i className="fas fa-user"></i>
                Мой профиль
              </DropdownItem>
              <DropdownItem to="/bookings">
                <i className="fas fa-calendar-check"></i>
                Мои бронирования
              </DropdownItem>
              {user?.role === 'admin' && (
                <DropdownItem to="/admin">
                  <i className="fas fa-cog"></i>
                  Администрирование
                </DropdownItem>
              )}
              <LogoutButton onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Выйти
              </LogoutButton>
            </DropdownMenu>
          </UserMenuContainer>
        ) : (
          <BookButton to="/booking">Забронировать</BookButton>
        )}
      </Nav>

      <MobileMenuOverlay isOpen={mobileMenuOpen} onClick={closeMobileMenu} />
    </HeaderContainer>
  );
};

export default Header; 