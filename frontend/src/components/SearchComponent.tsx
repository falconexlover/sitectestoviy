import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/api';
import { Room } from '../types/services';
import './SearchComponent.css';

interface SearchComponentProps {
  placeholder?: string;
  className?: string;
  onSelect?: (room: Room) => void;
  showSearchButton?: boolean;
  autoFocus?: boolean;
  minCharacters?: number;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  placeholder = 'Поиск номеров...',
  className = '',
  onSelect,
  showSearchButton = true,
  autoFocus = false,
  minCharacters = 2
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Room[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Обработчик клика вне компонента поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработчик изменения запроса поиска
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Если запрос пустой или слишком короткий, скрываем результаты
    if (!value || value.length < minCharacters) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Запускаем поиск
    performSearch(value);
  };

  // Функция выполнения поиска
  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);

      // Добавляем небольшую задержку для предотвращения слишком частых запросов
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Получаем результаты поиска
      const response = await roomService.getAll({
        // Преобразуем запрос в соответствующие параметры поиска
        // Например, ищем по имени комнаты или типу
        sort: 'name',
        limit: 5
      });

      if (response.status === 200) {
        // Фильтруем результаты локально, чтобы соответствовать запросу
        const filteredResults = response.data.rooms.filter((room) => {
          return (
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        setResults(filteredResults);
        setShowResults(true);
      } else {
        setError('Ошибка при получении результатов поиска');
        setResults([]);
      }
    } catch (error) {
      setError('Произошла ошибка при поиске');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик выбора результата поиска
  const handleSelectResult = (room: Room) => {
    setQuery('');
    setShowResults(false);

    if (onSelect) {
      // Если передан обработчик выбора, вызываем его
      onSelect(room);
    } else {
      // По умолчанию переходим на страницу выбранной комнаты
      navigate(`/rooms/${room.id}`);
    }
  };

  // Обработчик отправки формы поиска
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.length >= minCharacters) {
      navigate(`/rooms?search=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div className={`search-component ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
            onFocus={() => query.length >= minCharacters && setShowResults(true)}
            autoFocus={autoFocus}
          />
          {loading && <span className="search-loading">Загрузка...</span>}
          {showSearchButton && (
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          )}
        </div>

        {showResults && results.length > 0 && (
          <div className="search-results">
            <ul>
              {results.map((room) => (
                <li
                  key={room.id}
                  onClick={() => handleSelectResult(room)}
                  className="search-result-item"
                >
                  <div className="search-result-image">
                    {room.images && room.images.length > 0 ? (
                      <img src={room.images[0]} alt={room.name} />
                    ) : (
                      <div className="no-image">Нет изображения</div>
                    )}
                  </div>
                  <div className="search-result-info">
                    <h4>{room.name}</h4>
                    <p className="search-result-type">{room.type}</p>
                    <p className="search-result-price">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0
                      }).format(room.price)}{' '}
                      / ночь
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showResults && results.length === 0 && !loading && (
          <div className="search-no-results">
            Ничего не найдено. Попробуйте изменить запрос.
          </div>
        )}

        {error && <div className="search-error">{error}</div>}
      </form>
    </div>
  );
};

export default SearchComponent; 