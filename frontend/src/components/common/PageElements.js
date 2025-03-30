import styled from 'styled-components';
import { Link } from 'react-router-dom';

/**
 * Основные контейнеры для страниц
 */
export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.bgColor || 'white'};
`;

/**
 * Заголовки и подзаголовки
 */
export const PageHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
  font-family: 'Playfair Display', serif;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const Subtitle = styled.p`
  color: var(--text-color);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--dark-color);
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const SectionSubtitle = styled.span`
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: block;
`;

/**
 * Кнопки
 */
export const Button = styled.button`
  background-color: ${props => props.secondary ? 'transparent' : 'var(--primary-color)'};
  color: ${props => props.secondary ? 'var(--primary-color)' : 'white'};
  padding: ${props => props.large ? '1.2rem 2.5rem' : '0.9rem 1.5rem'};
  border: ${props => props.secondary ? '2px solid var(--primary-color)' : 'none'};
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: var(--shadow-sm);
  letter-spacing: 0.5px;
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  display: ${props => props.block ? 'block' : 'inline-block'};
  width: ${props => props.block ? '100%' : 'auto'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: var(--dark-color);
    transition: var(--transition);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  &:hover::before {
    width: 100%;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const LinkButton = styled(Link)`
  display: inline-block;
  padding: ${props => props.large ? '1.2rem 2.5rem' : '0.9rem 1.5rem'};
  background-color: ${props => props.secondary ? 'transparent' : 'var(--primary-color)'};
  color: ${props => props.secondary ? 'var(--primary-color)' : 'white'};
  border: ${props => props.secondary ? '2px solid var(--primary-color)' : 'none'};
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  text-align: center;

  &:hover {
    background-color: ${props => props.secondary ? 'var(--primary-color)' : 'var(--dark-color)'};
    color: white;
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
`;

/**
 * Формы
 */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: var(--transition);
  font-size: 1rem;
  width: 100%;
  background-color: var(--light-color);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.8;
  }
`;

export const Select = styled.select`
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
`;

export const Error = styled.div`
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

/**
 * Сетки и флекс контейнеры
 */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 'auto-fill'}, minmax(${props => props.minWidth || '300px'}, 1fr));
  gap: ${props => props.gap || '2rem'};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(${props => props.mobileMinWidth || '280px'}, 1fr));
  }
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'flex-start'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || '0'};
`;

/**
 * Аниметоры и загрузчики
 */
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid var(--light-color);
    border-top-color: var(--primary-color);
    animation: spinner 0.8s linear infinite;
  }
  
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Оповещения и информационные блоки
 */
export const Alert = styled.div`
  background-color: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(40, 167, 69, 0.1)';
      case 'warning': return 'rgba(255, 193, 7, 0.1)';
      case 'danger': return 'rgba(220, 53, 69, 0.1)';
      default: return 'rgba(0, 123, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'success': return 'var(--success-color)';
      case 'warning': return 'var(--warning-color)';
      case 'danger': return 'var(--error-color)';
      default: return 'var(--primary-color)';
    }
  }};
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'success': return 'var(--success-color)';
      case 'warning': return 'var(--warning-color)';
      case 'danger': return 'var(--error-color)';
      default: return 'var(--primary-color)';
    }
  }};
  font-size: 0.95rem;
`;

export const InfoBox = styled.div`
  background-color: ${props => props.bgColor || 'var(--light-color)'};
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin: ${props => props.margin || '1.5rem 0'};
  border-left: ${props => props.borderLeft || '4px solid var(--primary-color)'};
`; 