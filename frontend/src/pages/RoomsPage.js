import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, Form, Field } from 'formik';
import RoomCard from '../components/RoomCard';
import { roomService } from '../services/api';
import {
  Button, 
  Grid, 
  FormGroup, 
  Label, 
  Select,
  LoadingSpinner
} from '../components/common/PageElements';
import { StandardPage } from '../components/common/PageLayouts';

// Специфичные для этой страницы стили
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
`;

// Компонент страницы
const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    capacity: '',
    type: '',
    priceMin: '',
    priceMax: '',
    checkInDate: null,
    checkOutDate: null,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filters.capacity) params.capacity = filters.capacity;
      if (filters.type) params.type = filters.type;
      if (filters.priceMin) params.priceMin = filters.priceMin;
      if (filters.priceMax) params.priceMax = filters.priceMax;
      if (filters.checkInDate) params.checkInDate = filters.checkInDate.toISOString();
      if (filters.checkOutDate) params.checkOutDate = filters.checkOutDate.toISOString();

      const data = await roomService.getRooms(params);
      setRooms(data);
      setLoading(false);
    } catch (err) {
      setError('Не удалось загрузить номера. Пожалуйста, попробуйте позже.');
      setLoading(false);
      console.error('Error fetching rooms:', err);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const newFilters = {
        ...filters,
        ...values,
      };
      setFilters(newFilters);

      setLoading(true);
      const params = {};

      if (newFilters.capacity) params.capacity = newFilters.capacity;
      if (newFilters.type) params.type = newFilters.type;
      if (newFilters.priceMin) params.priceMin = newFilters.priceMin;
      if (newFilters.priceMax) params.priceMax = newFilters.priceMax;
      if (newFilters.checkInDate) params.checkInDate = newFilters.checkInDate.toISOString();
      if (newFilters.checkOutDate) params.checkOutDate = newFilters.checkOutDate.toISOString();

      const data = await roomService.getRooms(params);
      setRooms(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при фильтрации номеров.');
      setLoading(false);
      console.error('Error filtering rooms:', err);
    }
  };

  const clearFilters = async () => {
    const emptyFilters = {
      capacity: '',
      type: '',
      priceMin: '',
      priceMax: '',
      checkInDate: null,
      checkOutDate: null,
    };
    setFilters(emptyFilters);

    try {
      setLoading(true);
      const data = await roomService.getRooms({});
      setRooms(data);
      setLoading(false);
    } catch (err) {
      setError('Не удалось сбросить фильтры. Пожалуйста, попробуйте позже.');
      setLoading(false);
      console.error('Error clearing filters:', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return <div className="error">{error}</div>;
    }
    
    if (rooms.length === 0) {
      return (
        <NoRooms>
          <h3>Номера не найдены</h3>
          <p>К сожалению, нет доступных номеров, соответствующих вашим критериям.</p>
          <Button secondary onClick={clearFilters}>
            Сбросить фильтры
          </Button>
        </NoRooms>
      );
    }
    
    return (
      <Grid minWidth="350px" mobileMinWidth="280px">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </Grid>
    );
  };

  return (
    <StandardPage
      title="Номера и апартаменты"
      subtitle="Выберите номер, который соответствует вашим предпочтениям и потребностям для комфортного пребывания в нашем отеле"
    >
      <FiltersContainer>
        <FilterTitle>Подобрать номер</FilterTitle>
        <Formik
          initialValues={{
            capacity: filters.capacity,
            type: filters.type,
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
          }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <StyledForm>
              <FormGroup>
                <Label htmlFor="capacity">Вместимость</Label>
                <Select as="select" name="capacity">
                  <option value="">Любая</option>
                  <option value="1">1 человек</option>
                  <option value="2">2 человека</option>
                  <option value="3">3 человека</option>
                  <option value="4">4 человека</option>
                  <option value="5">5+ человек</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="type">Тип номера</Label>
                <Select as="select" name="type">
                  <option value="">Любой</option>
                  <option value="standard">Стандарт</option>
                  <option value="comfort">Комфорт</option>
                  <option value="business">Бизнес</option>
                  <option value="lux">Люкс</option>
                  <option value="apartment">Апартаменты</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="priceMin">Цена от</Label>
                <Select as="select" name="priceMin">
                  <option value="">Любая</option>
                  <option value="1000">1 000 ₽</option>
                  <option value="2000">2 000 ₽</option>
                  <option value="3000">3 000 ₽</option>
                  <option value="5000">5 000 ₽</option>
                  <option value="7000">7 000 ₽</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="priceMax">Цена до</Label>
                <Select as="select" name="priceMax">
                  <option value="">Любая</option>
                  <option value="3000">3 000 ₽</option>
                  <option value="5000">5 000 ₽</option>
                  <option value="7000">7 000 ₽</option>
                  <option value="10000">10 000 ₽</option>
                  <option value="15000">15 000 ₽</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Дата заезда</Label>
                <StyledDatePicker
                  selected={filters.checkInDate}
                  onChange={(date) => {
                    setFilters({ ...filters, checkInDate: date });
                  }}
                  placeholderText="Выберите дату"
                  dateFormat="dd.MM.yyyy"
                  minDate={new Date()}
                />
              </FormGroup>

              <FormGroup>
                <Label>Дата выезда</Label>
                <StyledDatePicker
                  selected={filters.checkOutDate}
                  onChange={(date) => {
                    setFilters({ ...filters, checkOutDate: date });
                  }}
                  placeholderText="Выберите дату"
                  dateFormat="dd.MM.yyyy"
                  minDate={filters.checkInDate || new Date()}
                />
              </FormGroup>

              <FormGroup>
                <Label>&nbsp;</Label>
                <Button type="submit" block uppercase>
                  Найти номера
                </Button>
              </FormGroup>

              <FormGroup>
                <Label>&nbsp;</Label>
                <Button 
                  type="button" 
                  secondary 
                  block 
                  onClick={clearFilters}
                >
                  Сбросить фильтры
                </Button>
              </FormGroup>
            </StyledForm>
          )}
        </Formik>
      </FiltersContainer>

      {renderContent()}
    </StandardPage>
  );
};

export default RoomsPage;
