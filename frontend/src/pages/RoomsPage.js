import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { roomService } from '../services/api';
import RoomCard from '../components/RoomCard';
import { Formik, Form, Field } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #003366;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const FiltersContainer = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 0.9rem;
`;

const Select = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #003366;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0.75rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #003366;
  }
`;

const Button = styled.button`
  background-color: #003366;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-end;
  
  &:hover {
    background-color: #002244;
  }
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const NoRooms = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #003366;
  }
  
  p {
    color: #666;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
`;

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getRooms();
        setRooms(response.data);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить номера');
        setLoading(false);
        console.error('Ошибка при загрузке номеров:', err);
      }
    };
    
    fetchRooms();
  }, []);
  
  const handleFilter = async (values) => {
    try {
      setLoading(true);
      setIsFiltered(true);
      
      // Форматируем даты для API
      const formattedCheckIn = values.checkIn ? values.checkIn.toISOString() : '';
      const formattedCheckOut = values.checkOut ? values.checkOut.toISOString() : '';
      
      const params = {
        ...(formattedCheckIn && { checkIn: formattedCheckIn }),
        ...(formattedCheckOut && { checkOut: formattedCheckOut }),
        ...(values.capacity && { capacity: values.capacity }),
        ...(values.roomType !== '' && { roomType: values.roomType })
      };
      
      // Если есть даты, используем эндпоинт для доступных номеров
      if (formattedCheckIn && formattedCheckOut) {
        const response = await roomService.getAvailableRooms(params);
        setRooms(response.data);
      } else {
        // Иначе получаем все номера
        const response = await roomService.getRooms();
        setRooms(response.data);
        
        // Фильтруем на клиенте если нужно
        if (values.capacity || values.roomType) {
          const filtered = response.data.filter(room => {
            return (
              (!values.capacity || room.capacity >= parseInt(values.capacity, 10)) &&
              (!values.roomType || room.roomType === values.roomType)
            );
          });
          setRooms(filtered);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Не удалось отфильтровать номера');
      setLoading(false);
      console.error('Ошибка при фильтрации номеров:', err);
    }
  };
  
  return (
    <div>
      <PageHeader>
        <Title>Наши номера</Title>
        <Subtitle>Выберите идеальный номер для вашего отдыха</Subtitle>
      </PageHeader>
      
      <FiltersContainer>
        <Formik
          initialValues={{
            checkIn: null,
            checkOut: null,
            capacity: '',
            roomType: ''
          }}
          onSubmit={handleFilter}
        >
          {({ values, setFieldValue }) => (
            <StyledForm>
              <FormGroup>
                <Label htmlFor="checkIn">Дата заезда</Label>
                <StyledDatePicker
                  id="checkIn"
                  selected={values.checkIn}
                  onChange={date => setFieldValue('checkIn', date)}
                  selectsStart
                  startDate={values.checkIn}
                  endDate={values.checkOut}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                  minDate={new Date()}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="checkOut">Дата выезда</Label>
                <StyledDatePicker
                  id="checkOut"
                  selected={values.checkOut}
                  onChange={date => setFieldValue('checkOut', date)}
                  selectsEnd
                  startDate={values.checkIn}
                  endDate={values.checkOut}
                  minDate={values.checkIn || new Date()}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="capacity">Кол-во гостей</Label>
                <Select as="select" id="capacity" name="capacity">
                  <option value="">Все</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="roomType">Тип номера</Label>
                <Select as="select" id="roomType" name="roomType">
                  <option value="">Все типы</option>
                  <option value="standard">Стандарт</option>
                  <option value="deluxe">Делюкс</option>
                  <option value="suite">Люкс</option>
                  <option value="family">Семейный</option>
                  <option value="executive">Премиум</option>
                </Select>
              </FormGroup>
              
              <Button type="submit">Применить фильтры</Button>
            </StyledForm>
          )}
        </Formik>
      </FiltersContainer>
      
      {loading ? (
        <LoadingSpinner>Загрузка номеров...</LoadingSpinner>
      ) : error ? (
        <div>{error}</div>
      ) : rooms.length > 0 ? (
        <RoomsGrid>
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </RoomsGrid>
      ) : (
        <NoRooms>
          <h3>Нет доступных номеров</h3>
          {isFiltered ? (
            <p>Попробуйте изменить параметры поиска или выбрать другие даты</p>
          ) : (
            <p>В данный момент все номера заняты</p>
          )}
        </NoRooms>
      )}
    </div>
  );
};

export default RoomsPage; 