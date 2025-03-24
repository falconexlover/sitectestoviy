import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  position: relative;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition);
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
`;

const ImageContainer = styled.div`
  height: 260px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
    pointer-events: none;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease-in-out;
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: ${({ type }) => (
    type === 'standard' ? 'var(--success-color)' :
    type === 'deluxe' ? 'var(--primary-color)' :
    type === 'suite' ? 'var(--secondary-color)' :
    type === 'family' ? 'var(--warning-color)' :
    'var(--accent-color)'
  )};
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  z-index: 10;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
`;

const Content = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  margin: 0 0 0.75rem;
  color: var(--dark-color);
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 2px;
    background-color: var(--accent-color);
  }
`;

const Description = styled.p`
  color: var(--text-color);
  margin: 0 0 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  
  span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-muted);
  }
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  
  i {
    font-size: 1rem;
    color: var(--accent-color);
  }
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  text-align: center;
  border: 2px solid var(--primary-color);
  margin-top: auto;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: white;
    transition: var(--transition);
    z-index: -1;
  }
  
  &:hover {
    color: var(--primary-color);
  }
  
  &:hover::before {
    width: 100%;
  }
`;

const RoomCard = ({ room }) => {
  // Используем первое изображение из массива или placeholder
  const imageUrl = room.images && room.images.length > 0
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';
  
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
        
        <Price>{room.price.toLocaleString()} ₽ <span>/ ночь</span></Price>
        
        <Features>
          <Feature>
            <i className="fas fa-user"></i> {room.capacity} {room.capacity === 1 ? 'гость' : 'гостей'}
          </Feature>
          <Feature>
            <i className="fas fa-building"></i> {room.floor} этаж
          </Feature>
          <Feature>
            <i className="fas fa-door-open"></i> №{room.roomNumber}
          </Feature>
        </Features>
        
        <Button to={`/rooms/${room.id}`}>Забронировать</Button>
      </Content>
    </Card>
  );
};

export default RoomCard; 