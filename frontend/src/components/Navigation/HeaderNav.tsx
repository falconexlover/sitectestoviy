import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Типы для элементов навигации
interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

// Типы для пропсов компонента
interface HeaderNavProps {
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
}

const HeaderNav: React.FC<HeaderNavProps> = ({
  logoSrc = '/images/logo.svg',
  logoAlt = 'Логотип Лесной Дворик',
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  
  // Массив элементов навигации
  const navItems: NavItem[] = [
    { path: '/', label: 'Главная' },
    { path: '/rooms', label: 'Номера' },
    { path: '/booking', label: 'Бронирование' },
    { path: '/gallery', label: 'Галерея' },
    { path: '/about', label: 'О нас' },
    { path: '/contacts', label: 'Контакты' },
  ];
  
  // Обработчик переключения мобильного меню
  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(prev => !prev);
  };
  
  // Закрытие мобильного меню
  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className={`header ${className}`}>
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logoSrc} alt={logoAlt} className="logo-image" />
            <span className="logo-text">Лесной Дворик</span>
          </Link>
        </div>
        
        {/* Мобильная кнопка меню */}
        <button 
          className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Меню"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="mobile-menu-icon"></span>
        </button>
        
        {/* Навигация */}
        <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.icon && <span className={`nav-icon ${item.icon}`}></span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Дополнительные кнопки в хедере */}
        <div className="header-actions">
          <button className="action-button search-button">
            Поиск
          </button>
          <Link to="/auth/login" className="action-button login-button">
            Войти
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav; 