import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.size === 'small' ? '0.1rem' : '0.25rem'};
`;

const StarIcon = styled.span`
  color: ${props => props.filled ? 'var(--star-color, #FFD700)' : 'var(--star-empty-color, #e0e0e0)'};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.9rem';
      case 'large': return '1.5rem';
      default: return '1.2rem';
    }
  }};
  cursor: ${props => props.readOnly ? 'default' : 'pointer'};
  transition: transform 0.1s ease, color 0.2s ease;

  &:hover {
    transform: ${props => props.readOnly ? 'none' : 'scale(1.2)'};
  }
`;

const RatingLabel = styled.span`
  margin-left: 0.5rem;
  font-size: ${props => props.size === 'small' ? '0.8rem' : '1rem'};
  color: var(--text-muted);
`;

/**
 * Компонент для отображения и выбора звездного рейтинга
 * 
 * @param {Object} props - Свойства компонента
 * @param {number} [props.value=0] - Текущее значение рейтинга
 * @param {Function} [props.onChange] - Функция обратного вызова при изменении рейтинга
 * @param {boolean} [props.readOnly=false] - Только для чтения
 * @param {number} [props.max=5] - Максимальное количество звезд
 * @param {string} [props.size='medium'] - Размер звезд: 'small', 'medium', 'large'
 * @param {boolean} [props.showValue=false] - Показывать числовое значение рейтинга
 * @param {boolean} [props.halfStars=false] - Разрешить половинные звезды
 */
const StarRating = ({ 
  value = 0, 
  onChange, 
  readOnly = false, 
  max = 5, 
  size = 'medium',
  showValue = false,
  halfStars = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Преобразуем значение рейтинга в число и обрабатываем половинные звезды
  const numericValue = parseFloat(value) || 0;
  
  // Обработчик наведения мыши
  const handleMouseEnter = (index) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };
  
  // Обработчик ухода мыши
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  // Обработчик клика
  const handleClick = (index) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };
  
  // Отображение звезд
  const renderStars = () => {
    const stars = [];
    
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

StarRating.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  max: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showValue: PropTypes.bool,
  halfStars: PropTypes.bool
};

export default StarRating; 