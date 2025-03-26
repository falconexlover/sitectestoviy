import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { roomService } from '../services/api';
import RoomCard from '../components/RoomCard';
import { Formik, Form, Field } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
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

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
  font-family: 'Playfair Display', serif;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--text-color);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FiltersContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  margin-bottom: 3rem;
  box-shadow: var(--shadow-lg);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  text-align: center;
  font-weight: 600;
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const Select = styled(Field)`
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

const StyledDatePicker = styled(DatePicker)`
  padding: 0.9rem 1rem;
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: var(--shadow-sm);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: block;
  width: 100%;

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
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const NoRooms = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
    font-family: 'Playfair Display', serif;
  }

  p {
    color: var(--text-color);
    margin-bottom: 2rem;
  }

  button {
    background-color: var(--accent-color);
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;

  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border-radius: 50%;
    border: 5px solid var(--light-color);
    border-top-color: var(--primary-color);
    animation: spinner 1s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ClearFilters = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: block;
  margin-left: auto;
  transition: var(--transition);

  &:hover {
    color: var(--accent-color);
  }
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

  const handleFilter = async values => {
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
        ...(values.roomType !== '' && { roomType: values.roomType }),
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

  const clearFilters = async () => {
    try {
      setLoading(true);
      setIsFiltered(false);

      const response = await roomService.getRooms();
      setRooms(response.data);
      setLoading(false);
    } catch (err) {
      setError('Не удалось загрузить номера');
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Наши номера</Title>
        <Subtitle>
          Выберите идеальный номер для вашего отдыха в "Лесном Дворике". У нас есть варианты для
          любых предпочтений и бюджета.
        </Subtitle>
      </PageHeader>

      <FiltersContainer>
        <FilterTitle>Найдите подходящий номер</FilterTitle>
        <Formik
          initialValues={{
            checkIn: null,
            checkOut: null,
            capacity: '',
            roomType: '',
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
                  <option value="">Любое</option>
                  <option value="1">1 гость</option>
                  <option value="2">2 гостя</option>
                  <option value="3">3 гостя</option>
                  <option value="4">4 гостя</option>
                  <option value="5">5+ гостей</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="roomType">Тип номера</Label>
                <Select as="select" id="roomType" name="roomType">
                  <option value="">Любой</option>
                  <option value="standard">Стандарт</option>
                  <option value="deluxe">Делюкс</option>
                  <option value="suite">Люкс</option>
                  <option value="family">Семейный</option>
                  <option value="executive">Премиум</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label style={{ opacity: 0 }}>.</Label>
                <Button type="submit">Найти номер</Button>
              </FormGroup>
            </StyledForm>
          )}
        </Formik>

        {isFiltered && <ClearFilters onClick={clearFilters}>Сбросить фильтры</ClearFilters>}
      </FiltersContainer>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <NoRooms>
          <h3>Произошла ошибка</h3>
          <p>{error}</p>
          <button onClick={clearFilters}>Попробовать снова</button>
        </NoRooms>
      ) : rooms.length === 0 ? (
        <NoRooms>
          <h3>Подходящих номеров не найдено</h3>
          <p>Попробуйте изменить параметры поиска или выбрать другие даты</p>
          <button onClick={clearFilters}>Сбросить фильтры</button>
        </NoRooms>
      ) : (
        <RoomsGrid>
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </RoomsGrid>
      )}
    </PageContainer>
  );
};

export default RoomsPage;
