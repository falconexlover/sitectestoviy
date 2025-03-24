import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ type }) => (
    type === 'standard' ? '#4caf50' :
    type === 'deluxe' ? '#2196f3' :
    type === 'suite' ? '#9c27b0' :
    type === 'family' ? '#ff9800' :
    '#3f51b5'
  )};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #003366;
  margin-bottom: 0.5rem;
`;

const Features = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.9rem;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: #003366;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  text-align: center;
  
  &:hover {
    background-color: #002244;
  }
`;

const RoomCard = ({ room }) => {
  // Используем первое изображение из массива или placeholder
  const imageUrl = room.images && room.images.length > 0
    ? room.images[0]
    : 'https://via.placeholder.com/300x200?text=Нет+изображения';
  
  // Русифицированные названия типов номеров
  const roomTypeNames = {
    standard: 'Стандарт',
    deluxe: 'Делюкс',
    suite: 'Люкс',
    family: 'Семейный',
    executive: 'Премиум'
  };
  
  return (
    <Card>
      <ImageContainer>
        <Image src={imageUrl} alt={room.name} />
        <Badge type={room.roomType}>{roomTypeNames[room.roomType] || room.roomType}</Badge>
      </ImageContainer>
      
      <Content>
        <Title>{room.name}</Title>
        <Description>{room.description}</Description>
        
        <Price>{room.price.toLocaleString()} ₽ / ночь</Price>
        
        <Features>
          <Feature>
            👤 {room.capacity} {room.capacity === 1 ? 'гость' : 'гостей'}
          </Feature>
          <Feature>
            🏢 {room.floor} этаж
          </Feature>
          <Feature>
            🏠 №{room.roomNumber}
          </Feature>
        </Features>
        
        <Button to={`/rooms/${room.id}`}>Забронировать</Button>
      </Content>
    </Card>
  );
};

export default RoomCard; 