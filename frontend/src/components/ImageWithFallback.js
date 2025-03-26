import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Стилизованный контейнер изображения с поддержкой разных размеров
 */
const ImageContainer = styled.div`
  width: 100%;
  height: ${props => props.height || 'auto'};
  overflow: hidden;
  position: relative;
`;

/**
 * Стилизованное изображение с эффектами
 */
const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  object-position: center;
  transition: transform 0.3s ease;
  transform: ${props => (props.isHovered ? 'scale(1.05)' : 'scale(1)')};
`;

/**
 * Компонент для отображения изображений с возможностью использования
 * оптимизированных версий и резервного изображения при ошибке загрузки.
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.src - Основной источник изображения
 * @param {string} props.fallbackSrc - Резервный источник изображения при ошибке загрузки основного
 * @param {string} props.alt - Альтернативный текст изображения
 * @param {string} props.height - Высота контейнера изображения
 * @param {string} props.objectFit - Способ размещения изображения внутри контейнера
 * @param {Object} props.responsiveSources - Объект с оптимизированными версиями изображения для разных размеров
 * @param {boolean} props.hover - Включить эффект увеличения при наведении
 */
const ImageWithFallback = ({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  alt = 'Изображение',
  height = 'auto',
  objectFit = 'cover',
  responsiveSources = null,
  hover = false,
}) => {
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Обработчик ошибки загрузки изображения
  const handleError = () => {
    if (!isError) {
      setIsError(true);
    }
  };

  // Источник изображения с учетом ошибки загрузки
  const imageSrc = isError ? fallbackSrc : src;

  // Проверяем наличие оптимизированных версий
  const hasResponsiveSources =
    responsiveSources &&
    (responsiveSources.small || responsiveSources.medium || responsiveSources.large);

  return (
    <ImageContainer
      height={height}
      onMouseEnter={hover ? () => setIsHovered(true) : undefined}
      onMouseLeave={hover ? () => setIsHovered(false) : undefined}
    >
      {hasResponsiveSources ? (
        <picture>
          {responsiveSources.small && (
            <source media="(max-width: 576px)" srcSet={responsiveSources.small} />
          )}
          {responsiveSources.medium && (
            <source media="(max-width: 992px)" srcSet={responsiveSources.medium} />
          )}
          {responsiveSources.large && (
            <source media="(min-width: 993px)" srcSet={responsiveSources.large} />
          )}
          <StyledImage
            src={imageSrc}
            alt={alt}
            objectFit={objectFit}
            isHovered={isHovered}
            onError={handleError}
          />
        </picture>
      ) : (
        <StyledImage
          src={imageSrc}
          alt={alt}
          objectFit={objectFit}
          isHovered={isHovered}
          onError={handleError}
        />
      )}
    </ImageContainer>
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string,
  height: PropTypes.string,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  responsiveSources: PropTypes.shape({
    small: PropTypes.string,
    medium: PropTypes.string,
    large: PropTypes.string,
  }),
  hover: PropTypes.bool,
};

export default ImageWithFallback;
