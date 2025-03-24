import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #003366;
  color: white;
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  
  a {
    color: white;
    text-decoration: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #ffd700;
    }
  }
`;

const Button = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: white;
    color: #003366;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link to="/">Лесной Дворик</Link>
        </Logo>
        <NavLinks>
          <Link to="/">Главная</Link>
          <Link to="/rooms">Номера</Link>
          
          {!user ? (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          ) : (
            <>
              <Link to="/bookings">Мои бронирования</Link>
              <Link to="/profile">Профиль</Link>
              
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link to="/admin/dashboard">Админ-панель</Link>
              )}
              
              <Button onClick={handleLogout}>Выйти</Button>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 