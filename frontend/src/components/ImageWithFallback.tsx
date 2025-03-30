import React, { useState, CSSProperties } from 'react';
import styled from 'styled-components';

/**
 * Интерфейс для источников изображений в различных разрешениях
 */
interface ResponsiveSources {
  small?: string;
  medium?: string;
  large?: string;
}

/**
 * Свойства компонента ImageWithFallback
 */
interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sources?: ResponsiveSources | null;
  hover?: boolean;
  style?: CSSProperties;
}

/**
 * Свойства для стилизованного контейнера изображения
 */
interface ImageContainerProps {
  height?: string;
}

/**
 * Свойства для стилизованного изображения
 */
interface StyledImageProps {
  objectFit?: string;
  isHovered?: boolean;
}

/**
 * Стилизованный контейнер изображения с поддержкой разных размеров
 */
const ImageContainer = styled.div<ImageContainerProps>`
  width: 100%;
  height: ${props => props.height || 'auto'};
  overflow: hidden;
  position: relative;
`;

/**
 * Стилизованное изображение с эффектами
 */
const StyledImage = styled.img<StyledImageProps>`
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
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  alt = 'Изображение',
  height = 'auto',
  objectFit = 'cover',
  sources = null,
  hover = false,
  style,
}) => {
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Обработчик ошибки загрузки изображения
  const handleError = (): void => {
    if (!isError) {
      setIsError(true);
    }
  };

  // Источник изображения с учетом ошибки загрузки
  const imageSrc = isError ? fallbackSrc : src;

  // Проверяем наличие оптимизированных версий
  const hasResponsiveSources =
    sources && (sources.small || sources.medium || sources.large);

  return (
    <ImageContainer
      height={height}
      onMouseEnter={hover ? () => setIsHovered(true) : undefined}
      onMouseLeave={hover ? () => setIsHovered(false) : undefined}
      style={style}
    >
      {hasResponsiveSources ? (
        <picture>
          {sources?.small && (
            <source media="(max-width: 576px)" srcSet={sources.small} />
          )}
          {sources?.medium && (
            <source media="(max-width: 992px)" srcSet={sources.medium} />
          )}
          {sources?.large && (
            <source media="(min-width: 993px)" srcSet={sources.large} />
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

export default ImageWithFallback;

