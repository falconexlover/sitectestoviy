import React from 'react';
import { Link } from 'react-router-dom';

// Типы для футера
interface FooterProps {
  className?: string;
}

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  // Категории ссылок в футере
  const footerSections: FooterSection[] = [
    {
      title: 'О нас',
      links: [
        { label: 'История', path: '/about/history' },
        { label: 'Команда', path: '/about/team' },
        { label: 'Отзывы', path: '/reviews' },
        { label: 'Галерея', path: '/gallery' },
      ],
    },
    {
      title: 'Услуги',
      links: [
        { label: 'Номера', path: '/rooms' },
        { label: 'Бронирование', path: '/booking' },
        { label: 'Ресторан', path: '/restaurant' },
        { label: 'Спа-центр', path: '/spa' },
      ],
    },
    {
      title: 'Информация',
      links: [
        { label: 'Правила проживания', path: '/rules' },
        { label: 'Часто задаваемые вопросы', path: '/faq' },
        { label: 'Политика конфиденциальности', path: '/privacy' },
        { label: 'Условия использования', path: '/terms' },
      ],
    },
  ];

  // Получаем текущий год для копирайта
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`}>
      <div className="footer-top">
        <div className="footer-logo">
          <Link to="/" className="footer-logo-link">
            <img src="/images/logo.svg" alt="Лесной Дворик" className="footer-logo-image" />
            <div className="footer-logo-text">
              <h3>Лесной Дворик</h3>
              <p>Гостиничный комплекс</p>
            </div>
          </Link>
        </div>

        <div className="footer-navigation">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4 className="footer-section-title">{section.title}</h4>
              <ul className="footer-links-list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="footer-link-item">
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-contact">
          <h4 className="footer-section-title">Контакты</h4>
          <address className="footer-address">
            <p>
              <i className="icon-location"></i>
              Московская область, г. Дмитров, ул. Лесная, 15
            </p>
            <p>
              <i className="icon-phone"></i>
              <a href="tel:+74984831941">+7 (498) 483-19-41</a>
            </p>
            <p>
              <i className="icon-email"></i>
              <a href="mailto:info@lesnoy-dvorik.ru">info@lesnoy-dvorik.ru</a>
            </p>
          </address>
          <div className="footer-social">
            <a href="https://vk.com/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-vk"></i>
            </a>
            <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-telegram"></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {currentYear} Гостиничный комплекс "Лесной Дворик". Все права защищены.
        </p>
        <p className="developer">
          Разработка сайта: <a href="https://example.com" target="_blank" rel="noopener noreferrer">Студия Веб-Дизайна</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 