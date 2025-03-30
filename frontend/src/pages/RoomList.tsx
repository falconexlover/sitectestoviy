import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from '../components/Room/RoomCard';
import { Room, ApiResponse } from '../types';

// В реальном приложении используйте axios или fetch для запросов к API
const fetchRooms = async (): Promise<Room[]> => {
  // Имитация запроса к API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          number: '101',
          type: {
            id: '1',
            name: 'Стандарт',
            description: 'Уютный стандартный номер с одной двуспальной кроватью',
            capacity: 2,
            price: 3500,
            images: ['/images/rooms/standard1.jpg', '/images/rooms/standard2.jpg'],
            amenities: ['Кондиционер', 'Телевизор', 'Холодильник', 'Wi-Fi', 'Душ']
          },
          isAvailable: true,
          floor: 1
        },
        {
          id: '2',
          number: '102',
          type: {
            id: '1',
            name: 'Стандарт',
            description: 'Уютный стандартный номер с одной двуспальной кроватью',
            capacity: 2,
            price: 3500,
            images: ['/images/rooms/standard1.jpg', '/images/rooms/standard2.jpg'],
            amenities: ['Кондиционер', 'Телевизор', 'Холодильник', 'Wi-Fi', 'Душ']
          },
          isAvailable: false,
          floor: 1
        },
        {
          id: '3',
          number: '201',
          type: {
            id: '2',
            name: 'Люкс',
            description: 'Просторный номер люкс с панорамным видом и джакузи',
            capacity: 4,
            price: 7500,
            images: ['/images/rooms/lux1.jpg', '/images/rooms/lux2.jpg'],
            amenities: ['Кондиционер', 'Телевизор', 'Мини-бар', 'Wi-Fi', 'Джакузи', 'Балкон']
          },
          isAvailable: true,
          floor: 2
        }
      ]);
    }, 1000);
  });
};

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    priceMin?: number;
    priceMax?: number;
    capacity?: number;
  }>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить список номеров');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleBookClick = (roomId: string) => {
    navigate(`/booking/${roomId}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value ? Number(value) : undefined
    }));
  };

  // Фильтрация номеров
  const filteredRooms = rooms.filter(room => {
    if (filter.priceMin && room.type.price < filter.priceMin) return false;
    if (filter.priceMax && room.type.price > filter.priceMax) return false;
    if (filter.capacity && room.type.capacity < filter.capacity) return false;
    return true;
  });

  if (isLoading) {
    return <div className="loading">Загрузка номеров...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="room-list-page">
      <h1>Номера нашего отеля</h1>
      
      <div className="filters">
        <h2>Фильтры</h2>
        <div className="filter-group">
          <label>
            Мин. цена:
            <input 
              type="number" 
              name="priceMin" 
              value={filter.priceMin || ''} 
              onChange={handleFilterChange}
              min="0"
            />
          </label>
          
          <label>
            Макс. цена:
            <input 
              type="number" 
              name="priceMax" 
              value={filter.priceMax || ''} 
              onChange={handleFilterChange}
              min="0"
            />
          </label>
          
          <label>
            Количество человек:
            <select 
              name="capacity" 
              value={filter.capacity || ''} 
              onChange={handleFilterChange}
            >
              <option value="">Любое</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="room-list">
        {filteredRooms.length === 0 ? (
          <p className="no-results">По вашему запросу номеров не найдено</p>
        ) : (
          filteredRooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onBookClick={handleBookClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList; 