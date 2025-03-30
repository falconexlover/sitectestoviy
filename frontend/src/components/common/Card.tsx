import React, { PropsWithChildren } from 'react';
import styled, { css, keyframes } from 'styled-components';

export type CardVariant = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
export type CardSize = 'small' | 'medium' | 'large';
export type CardAnimation = 'fadeIn' | 'slideUp' | 'scale' | 'none';

interface CardProps {
  variant?: CardVariant;
  size?: CardSize;
  elevation?: 0 | 1 | 2 | 3;
  rounded?: boolean;
  animation?: CardAnimation;
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
}

// Анимации
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const scale = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// Варианты цветов карточек
const cardVariants = {
  primary: css`
    background-color: var(--primary-color);
    color: white;
  `,
  secondary: css`
    background-color: white;
    color: var(--text-color);
    border: 1px solid var(--border-color);
  `,
  info: css`
    background-color: var(--info-color, #17a2b8);
    color: white;
  `,
  success: css`
    background-color: var(--success-color, #28a745);
    color: white;
  `,
  warning: css`
    background-color: var(--warning-color, #ffc107);
    color: var(--dark-color, #343a40);
  `,
  danger: css`
    background-color: var(--danger-color, #dc3545);
    color: white;
  `,
};

// Варианты размеров
const cardSizes = {
  small: css`
    padding: 0.75rem;
  `,
  medium: css`
    padding: 1.5rem;
  `,
  large: css`
    padding: 2.5rem;
  `,
};

// Варианты тени (elevation)
const cardElevations = {
  0: css`
    box-shadow: none;
  `,
  1: css`
    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  `,
  2: css`
    box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.12));
  `,
  3: css`
    box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.12));
  `,
};

// Анимации для карточки
const cardAnimations = {
  fadeIn: css`
    animation: ${fadeIn} 0.5s ease forwards;
  `,
  slideUp: css`
    animation: ${slideUp} 0.5s ease forwards;
  `,
  scale: css`
    animation: ${scale} 0.3s ease forwards;
  `,
  none: css``,
};

const CardContainer = styled.div<CardProps>`
  position: relative;
  border-radius: ${props => (props.rounded ? 'var(--radius-md, 8px)' : '0')};
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  opacity: ${props => (props.animation !== 'none' ? '0' : '1')};
  
  ${props => cardVariants[props.variant || 'secondary']}
  ${props => cardSizes[props.size || 'medium']}
  ${props => cardElevations[props.elevation || 2]}
  ${props => cardAnimations[props.animation || 'none']}
  
  animation-delay: ${props => props.animationDelay || 0}ms;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.elevation !== 0 ? 'var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.15))' : 'none'};
  }
`;

const Card: React.FC<PropsWithChildren<CardProps>> = ({ 
  children, 
  variant = 'secondary',
  size = 'medium',
  elevation = 2,
  rounded = true,
  animation = 'none',
  animationDelay = 0,
  className = '',
  onClick,
}) => {
  return (
    <CardContainer
      variant={variant}
      size={size}
      elevation={elevation}
      rounded={rounded}
      animation={animation}
      animationDelay={animationDelay}
      className={className}
      onClick={onClick}
    >
      {children}
    </CardContainer>
  );
};

export default Card; 