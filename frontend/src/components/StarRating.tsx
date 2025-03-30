import React, { useState } from 'react';
import styled from 'styled-components';

type StarSize = 'small' | 'medium' | 'large';

interface StarRatingProps {
  value?: number | string;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  max?: number;
  size?: StarSize;
  showValue?: boolean;
  halfStars?: boolean;
}

interface RatingContainerProps {
  size?: StarSize;
}

interface StarIconProps {
  filled: boolean;
  size?: StarSize;
  readOnly?: boolean;
}

interface RatingLabelProps {
  size?: StarSize;
}

const RatingContainer = styled.div<RatingContainerProps>`
  display: flex;
  align-items: center;
  gap: ${props => (props.size === 'small' ? '0.1rem' : '0.25rem')};
`;

const StarIcon = styled.span<StarIconProps>`
  color: ${props =>
    props.filled ? 'var(--star-color, #FFD700)' : 'var(--star-empty-color, #e0e0e0)'};
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return '0.9rem';
      case 'large':
        return '1.5rem';
      default:
        return '1.2rem';
    }
  }};
  cursor: ${props => (props.readOnly ? 'default' : 'pointer')};
  transition:
    transform 0.1s ease,
    color 0.2s ease;

  &:hover {
    transform: ${props => (props.readOnly ? 'none' : 'scale(1.2)')};
  }
`;

const RatingLabel = styled.span<RatingLabelProps>`
  margin-left: 0.5rem;
  font-size: ${props => (props.size === 'small' ? '0.8rem' : '1rem')};
  color: var(--text-muted);
`;

/**
 * Компонент для отображения и выбора звездного рейтинга
 */
const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readOnly = false,
  max = 5,
  size = 'medium',
  showValue = false,
  halfStars = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Преобразуем значение рейтинга в число и обрабатываем половинные звезды
  const numericValue = parseFloat(value as string) || 0;

  // Обработчик наведения мыши
  const handleMouseEnter = (index: number): void => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  // Обработчик ухода мыши
  const handleMouseLeave = (): void => {
    setHoverRating(0);
  };

  // Обработчик клика
  const handleClick = (index: number): void => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };

  // Отображение звезд
  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];

    for (let i = 1; i <= max; i++) {
      const currentRating = hoverRating || numericValue;

      // Определяем, заполнена ли звезда полностью, наполовину или не заполнена
      let starIcon = 'far fa-star'; // Пустая звезда

      if (halfStars) {
        if (currentRating >= i) {
          starIcon = 'fas fa-star'; // Полная звезда
        } else if (currentRating + 0.5 >= i) {
          starIcon = 'fas fa-star-half-alt'; // Половина звезды
        }
      } else {
        if (currentRating >= i) {
          starIcon = 'fas fa-star'; // Полная звезда
        }
      }

      stars.push(
        <StarIcon
          key={i}
          className={starIcon}
          filled={currentRating >= i || (halfStars && currentRating + 0.5 >= i)}
          size={size}
          readOnly={readOnly}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        />
      );
    }

    return stars;
  };

  return (
    <RatingContainer size={size}>
      {renderStars()}
      {showValue && <RatingLabel size={size}>{numericValue.toFixed(1)}</RatingLabel>}
    </RatingContainer>
  );
};

export default StarRating; 