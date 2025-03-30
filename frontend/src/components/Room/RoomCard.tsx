import React, { useState } from 'react';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  onBookClick: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % room.type.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? room.type.images.length - 1 : prevIndex - 1
    );
  };

  const toggleDetails = () => {
    setIsDetailsVisible(prev => !prev);
  };

  return (
    <div className="room-card">
      <div className="room-card-image-container">
        <button className="nav-button prev" onClick={handlePrevImage}>
          &lt;
        </button>
        
        <img 
          src={room.type.images[currentImageIndex]} 
          alt={`Номер ${room.number}`} 
          className="room-image"
        />
        
        <button className="nav-button next" onClick={handleNextImage}>
          &gt;
        </button>
      </div>
      
      <div className="room-card-content">
        <h3>Номер {room.number}</h3>
        <p className="room-type">{room.type.name}</p>
        <p className="room-price">{room.type.price} ₽/ночь</p>
        
        <div className="room-features">
          <span>Этаж: {room.floor}</span>
          <span>Вместимость: до {room.type.capacity} чел.</span>
        </div>
        
        <button 
          className="details-button" 
          onClick={toggleDetails}
        >
          {isDetailsVisible ? 'Скрыть детали' : 'Показать детали'}
        </button>
        
        {isDetailsVisible && (
          <div className="room-details">
            <p className="room-description">{room.type.description}</p>
            <h4>Удобства:</h4>
            <ul className="amenities-list">
              {room.type.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          className="book-button"
          disabled={!room.isAvailable}
          onClick={() => onBookClick(room.id)}
        >
          {room.isAvailable ? 'Забронировать' : 'Недоступен'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard; 