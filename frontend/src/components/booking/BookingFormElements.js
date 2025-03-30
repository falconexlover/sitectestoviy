import styled from 'styled-components';
import DatePicker from 'react-datepicker';

/**
 * Основные компоненты для выбора типа бронирования
 */
export const BookingTypeSelector = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--light-color);
  border: 1px solid var(--border-color);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

export const BookingTypeButton = styled.button`
  flex: 1;
  padding: 1.2rem;
  border: none;
  background-color: ${props => (props.active ? 'var(--primary-color)' : 'transparent')};
  color: ${props => (props.active ? 'white' : 'var(--text-color)')};
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => (props.active ? 'var(--accent-color)' : 'var(--light-hover)')};
  }
  
  &:not(:last-child) {
    border-right: 1px solid var(--border-color);
  }
  
  @media (max-width: 576px) {
    &:not(:last-child) {
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
  }
`;

/**
 * Компоненты для разделов формы
 */
export const FormSection = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

/**
 * Элементы формы
 */
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--dark-color);
  font-size: 0.95rem;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

export const FormError = styled.div`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

/**
 * Компонент DatePicker
 */
export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
`;

/**
 * Компоненты для итоговой суммы и деталей
 */
export const PriceSummary = styled.div`
  background-color: var(--light-color);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
`;

export const SummaryTitle = styled.h3`
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
`;

export const SummaryPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

export const SummaryDetails = styled.div`
  font-size: 0.95rem;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px dashed var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  span:first-child {
    color: var(--text-muted);
  }
  
  span:last-child {
    font-weight: 600;
    color: var(--dark-color);
  }
`;

/**
 * Компоненты для кнопки и политики бронирования
 */
export const BookingFormButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const BookingPolicy = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.6;
`;

export const PolicyLink = styled.a`
  color: var(--primary-color);
  text-decoration: underline;
  transition: all 0.3s;
  
  &:hover {
    color: var(--accent-color);
  }
`;

/**
 * Компоненты информационного блока
 */
export const BookingInfo = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-top: 3rem;
  border-left: 4px solid var(--primary-color);
`;

export const InfoTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 1rem;
`;

export const InfoText = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: var(--dark-color);
  }
`; 