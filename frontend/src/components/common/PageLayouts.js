import React from 'react';
import { PageContainer, PageHeader, Title, Subtitle } from './PageElements';

/**
 * Стандартный макет для страниц
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок страницы
 * @param {string} props.subtitle - Подзаголовок страницы
 * @param {React.ReactNode} props.children - Содержимое страницы
 * @param {boolean} props.centered - Центрировать содержимое или нет
 * @param {string} props.maxWidth - Максимальная ширина контента
 */
export const StandardPage = ({ 
  title, 
  subtitle, 
  children, 
  centered = false,
  maxWidth 
}) => {
  return (
    <PageContainer style={{ maxWidth: maxWidth || '1200px' }}>
      <PageHeader>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </PageHeader>
      
      <div style={centered ? { display: 'flex', justifyContent: 'center' } : {}}>
        {children}
      </div>
    </PageContainer>
  );
};

/**
 * Макет для страниц с левой и правой колонками
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок страницы
 * @param {string} props.subtitle - Подзаголовок страницы
 * @param {React.ReactNode} props.leftColumn - Содержимое левой колонки
 * @param {React.ReactNode} props.rightColumn - Содержимое правой колонки
 * @param {string} props.leftWidth - Ширина левой колонки (в процентах или пикселях)
 * @param {string} props.rightWidth - Ширина правой колонки (в процентах или пикселях)
 * @param {string} props.gap - Отступ между колонками
 */
export const TwoColumnPage = ({
  title,
  subtitle,
  leftColumn,
  rightColumn,
  leftWidth = '60%',
  rightWidth = '40%',
  gap = '3rem'
}) => {
  return (
    <PageContainer>
      <PageHeader>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </PageHeader>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `${leftWidth} ${rightWidth}`,
        gap: gap,
        '@media (max-width: 992px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        <div>{leftColumn}</div>
        <div>{rightColumn}</div>
      </div>
    </PageContainer>
  );
};

/**
 * Макет для страниц с баннером сверху
 * @param {Object} props - Свойства компонента
 * @param {string} props.bannerImageUrl - URL изображения для баннера
 * @param {string} props.bannerHeight - Высота баннера
 * @param {string} props.title - Заголовок страницы (отображается на баннере)
 * @param {string} props.subtitle - Подзаголовок страницы (отображается на баннере)
 * @param {React.ReactNode} props.children - Основное содержимое страницы
 */
export const BannerPage = ({
  bannerImageUrl,
  bannerHeight = '400px',
  title,
  subtitle,
  children
}) => {
  const bannerStyle = {
    height: bannerHeight,
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '3rem',
    position: 'relative'
  };

  const bannerContentStyle = {
    color: 'white',
    zIndex: 1,
    maxWidth: '800px',
    padding: '0 2rem'
  };

  return (
    <>
      <div style={bannerStyle}>
        <div style={bannerContentStyle}>
          <Title style={{ color: 'white' }}>{title}</Title>
          {subtitle && <Subtitle style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{subtitle}</Subtitle>}
        </div>
      </div>
      
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
}; 