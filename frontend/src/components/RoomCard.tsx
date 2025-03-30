import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ImageWithFallback from './ImageWithFallback';
import { RoomType } from '../types/room';

interface RoomCardProps {
  room: RoomType;
}

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
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
  }
`;

interface BadgeProps {
  type?: string;
}

const Badge = styled.span<BadgeProps>`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: ${({ type }) =>
    type === 'standard'
      ? 'var(--success-color)'
      : type === 'deluxe'
        ? 'var(--primary-color)'
        : type === 'suite'
          ? 'var(--secondary-color)'
          : type === 'family'
            ? 'var(--warning-color)'
            : 'var(--accent-color)'};
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  z-index: 10;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
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

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  // Преобразуем массив изображений, если он в виде строки
  let images = room.images || [];
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch (e) {
      images = [];
    }
  }

  // Получаем URL основного изображения
  const mainImage =
    images.length > 0
      ? `${process.env.REACT_APP_API_URL}/uploads/rooms/${images[0]}`
      : '/images/room-placeholder.jpg';

  // Если есть оптимизированные версии, используем их
  const responsiveSources = room.optimizedImages?.[0] || null;

  // Русифицированные названия типов номеров
  const roomTypeNames: Record<string, string> = {
    standard: 'Стандарт',
    deluxe: 'Делюкс',
    suite: 'Люкс',
    family: 'Семейный',
    studio: 'Студия',
  };

  // Иконки для удобств
  const amenityIcons: Record<string, string> = {
    wifi: 'wifi',
    parking: 'car',
    breakfast: 'coffee',
    airConditioner: 'snowflake',
    tv: 'tv',
    fridge: 'cube',
    bath: 'bath',
    desk: 'table',
    // Другие иконки для различных удобств
  };

  // Получаем локализованное название типа
  const roomTypeName = roomTypeNames[room.type] || room.type;

  // Форматируем цену для отображения
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(room.price);

  // Подготавливаем список удобств для отображения
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];

  return (
    <Card>
      {/* Тип номера */}
      <Badge type={room.type}>{roomTypeName}</Badge>

      {/* Изображение */}
      <ImageContainer>
        <ImageWithFallback
          src={mainImage}
          fallbackSrc="/images/room-placeholder.jpg"
          alt={room.name}
          sources={responsiveSources}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </ImageContainer>

      {/* Информация о номере */}
      <Content>
        <Title>{room.name}</Title>
        <Description>{room.description}</Description>
        <Price>
          {formattedPrice} ₽<span> / ночь</span>
        </Price>

        {/* Удобства */}
        <Features>
          {amenities.slice(0, 4).map((amenity, index) => (
            <Feature key={index}>
              <i className={`fas fa-${amenityIcons[amenity] || 'check'}`}></i>
              {amenity}
            </Feature>
          ))}
        </Features>

        {/* Кнопка детали и бронирование */}
        <Button to={`/rooms/${room.id}`}>Подробнее</Button>
      </Content>
    </Card>
  );
};

export default RoomCard;

