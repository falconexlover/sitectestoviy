import React from 'react';
import {
  RoomCard as RoomCardContainer,
  RoomImageContainer,
  RoomImage,
  RoomStatus,
  RoomContent,
  RoomTitle,
  RoomType,
  RoomDetails,
  RoomFeature,
  RoomPrice,
  Price,
  PriceUnit,
  RoomActions,
  EditButton,
  DeleteButton,
} from './RoomStyles';
import { Room, roomTypes } from './types';

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  return (
    <RoomCardContainer>
      <RoomImageContainer>
        <RoomImage
          src={room.images?.[0] || 'https://via.placeholder.com/400x200?text=Нет+изображения'}
          alt={room.title}
        />
        <RoomStatus active={room.isActive}>
          {room.isActive ? 'Активен' : 'Неактивен'}
        </RoomStatus>
      </RoomImageContainer>
      <RoomContent>
        <RoomTitle>{room.title}</RoomTitle>
        <RoomType>
          {roomTypes.find(type => type.value === room.type)?.label || room.type} | Номер{' '}
          {room.number}
        </RoomType>
        <RoomDetails>
          <RoomFeature>
            <i className="fas fa-user"></i> {room.capacity} гостей
          </RoomFeature>
          <RoomFeature>
            <i className="fas fa-bed"></i> {room.beds} кроватей
          </RoomFeature>
          <RoomFeature>
            <i className="fas fa-bath"></i> {room.bathrooms} ванных
          </RoomFeature>
          <RoomFeature>
            <i className="fas fa-ruler-combined"></i> {room.area} м²
          </RoomFeature>
        </RoomDetails>
        <RoomPrice>
          <div>
            <Price>{room.price.toLocaleString('ru-RU')} ₽</Price>
            <PriceUnit> / ночь</PriceUnit>
          </div>
        </RoomPrice>
        <RoomActions>
          <EditButton onClick={() => onEdit(room)}>
            <i className="fas fa-edit"></i> Редактировать
          </EditButton>
          <DeleteButton onClick={() => onDelete(room)}>
            <i className="fas fa-trash-alt"></i> Удалить
          </DeleteButton>
        </RoomActions>
      </RoomContent>
    </RoomCardContainer>
  );
};

export default RoomCard; 