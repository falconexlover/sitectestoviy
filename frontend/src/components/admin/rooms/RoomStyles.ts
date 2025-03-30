import styled from 'styled-components';

// Основные контейнеры
export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
`;

// Кнопки
export const ActionButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #219653;
  }

  i {
    font-size: 1.2rem;
  }
`;

export const EditButton = styled.button`
  flex: 1;
  padding: 0.6rem 0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: #e0e0e0;
  }

  i {
    font-size: 1rem;
  }
`;

export const DeleteButton = styled(EditButton)`
  background-color: #fff0f0;
  color: #e53935;

  &:hover {
    background-color: #ffebee;
  }
`;

export const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #27ae60;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #219653;
  }
`;

export const ConfirmDeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #e53935;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c62828;
  }
`;

export const ConfirmCancelButton = styled(CancelButton)``;

// Фильтры
export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #3498db;
    }
  }

  i {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

// Сетка номеров
export const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Карточка номера
export const RoomCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const RoomImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

export const RoomImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  ${RoomCard}:hover & {
    transform: scale(1.05);
  }
`;

export const RoomStatus = styled.span<{ active: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => (props.active ? '#e3f7ed' : '#ffebee')};
  color: ${props => (props.active ? '#1d8a4e' : '#e53935')};
`;

export const RoomContent = styled.div`
  padding: 1.5rem;
`;

export const RoomTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem;
`;

export const RoomType = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0 0 1rem;
`;

export const RoomDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const RoomFeature = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #2c3e50;

  i {
    color: #7f8c8d;
  }
`;

export const RoomPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

export const Price = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
`;

export const PriceUnit = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

export const RoomActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

// Модальные окна
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #7f8c8d;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2c3e50;
  }
`;

export const DeleteConfirmModal = styled(ModalContent)`
  max-width: 400px;
  text-align: center;
`;

export const ConfirmText = styled.p`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

export const ConfirmButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

// Формы
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

export const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #3498db;
  }
`;

export const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    width: 18px;
    height: 18px;
  }

  label {
    font-size: 0.9rem;
    color: #2c3e50;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

// Пагинация
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => (props.active ? '#3498db' : '#e0e0e0')};
  border-radius: 4px;
  background-color: ${props => (props.active ? '#3498db' : 'white')};
  color: ${props => (props.active ? 'white' : '#2c3e50')};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.active ? '#2980b9' : '#f0f0f0')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Состояния
export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

export const LoadingIndicator = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
`;

export const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;

  i {
    font-size: 3rem;
    color: #95a5a6;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 1.5rem;
  }
`; 