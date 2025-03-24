import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roomService } from '../services/api';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: block;
  margin-bottom: 20px;
  color: #003366;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RoomTitle = styled.h1`
  color: #003366;
  margin-bottom: 20px;
`;

const RoomImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const RoomInfo = styled.div`
  margin-bottom: 20px;
`;

const RoomType = styled.span`
  background-color: #003366;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  margin-right: 10px;
`;

const RoomPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #003366;
  margin: 20px 0;
`;

const SectionTitle = styled.h2`
  color: #003366;
  margin: 20px 0 10px 0;
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const AmenityItem = styled.div`
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const BookingSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
`;

const LoginButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #003366;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-right: 10px;
`;

const RegisterButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: transparent;
  color: #003366;
  text-decoration: none;
  border: 1px solid #003366;
  border-radius: 4px;
`;

const RoomDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Placeholder изображения
  const placeholderImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';
  
  useEffect(() => {
    console.log('RoomDetailPage: Загрузка комнаты с ID:', id);
    
    const fetchRoom = async () => {
      try {
        console.log('Отправка запроса к API для комнаты с ID:', id);
        const response = await roomService.getRoomById(id);
        console.log('Получен ответ от API:', response.data);
        setRoom(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке номера:', err);
        setError('Не удалось загрузить информацию о номере');
        setLoading(false);
      }
    };
    
    fetchRoom();
  }, [id]);
  
  if (loading) {
    return (
      <Container>
        <div>Загрузка данных о номере...</div>
      </Container>
    );
  }
  
  if (error || !room) {
    return (
      <Container>
        <BackLink to="/rooms">← Назад к списку номеров</BackLink>
        <div>{error || 'Номер не найден'}</div>
      </Container>
    );
  }
  
  // Преобразование типа номера для отображения
  const roomTypeNames = {
    'standard': 'Стандарт',
    'deluxe': 'Делюкс',
    'suite': 'Люкс',
    'family': 'Семейный',
    'executive': 'Премиум'
  };
  
  return (
    <Container>
      <BackLink to="/rooms">← Назад к списку номеров</BackLink>
      
      <RoomTitle>{room.name}</RoomTitle>
      
      <RoomInfo>
        <RoomType>
          {roomTypeNames[room.roomType] || room.roomType}
        </RoomType>
        <span>Номер {room.roomNumber}</span>
      </RoomInfo>
      
      <RoomPrice>
        {room.price.toLocaleString()} ₽
        <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666' }}> за ночь</span>
      </RoomPrice>
      
      <RoomImage 
        src={room.images && room.images.length > 0 ? room.images[selectedImage] : placeholderImage} 
        alt={room.name}
      />
      
      <SectionTitle>Описание</SectionTitle>
      <p>{room.description}</p>
      
      <SectionTitle>Детали номера</SectionTitle>
      <AmenitiesList>
        <AmenityItem>👤 Вместимость: {room.capacity} гостей</AmenityItem>
        <AmenityItem>🏢 Этаж: {room.floor || 1}</AmenityItem>
        <AmenityItem>📏 Площадь: {room.area || '25'} м²</AmenityItem>
        <AmenityItem>🛏️ Кровати: {room.beds || '1 двуспальная'}</AmenityItem>
      </AmenitiesList>
      
      <SectionTitle>Удобства</SectionTitle>
      <AmenitiesList>
        {room.amenities && room.amenities.map((amenity, index) => (
          <AmenityItem key={index}>✓ {amenity}</AmenityItem>
        ))}
      </AmenitiesList>
      
      <BookingSection>
        <h3 style={{ marginBottom: '10px' }}>Хотите забронировать этот номер?</h3>
        <p style={{ marginBottom: '20px' }}>Для бронирования необходимо войти в систему.</p>
        <div>
          <LoginButton to="/login">Войти</LoginButton>
          <RegisterButton to="/register">Зарегистрироваться</RegisterButton>
        </div>
      </BookingSection>
    </Container>
  );
};

export default RoomDetailPage; 