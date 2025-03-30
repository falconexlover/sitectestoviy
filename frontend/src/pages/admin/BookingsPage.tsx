import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { Booking, BookingStatus } from '../../types/services';

// Интерфейс для отображаемых бронирований с нужными полями для UI
interface DisplayBooking {
  id: string;
  reservationNumber: string;
  checkIn: string;
  checkOut: string;
  roomNumber: string;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

interface PageButtonProps {
  active?: boolean;
}

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #3498db;
    }
  }

  i {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const DateRangeFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-width: 300px;

  i {
    color: #7f8c8d;
    margin-right: 0.5rem;
  }

  input {
    padding: 0.25rem;
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: #2c3e50;
    width: 120px;
  }

  span {
    color: #7f8c8d;
  }
`;

const BookingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #e0e0e0;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1rem;
    color: #2c3e50;
  }
`;

const ActionLink = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.2s;
  margin-right: 0.5rem;

  &:hover {
    background-color: #e0e0e0;
  }

  i {
    margin-right: 0.25rem;
  }
`;

const StatusSelect = styled.select`
  padding: 0.4rem 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.85rem;
  background-color: #f9f9f9;
  color: #2c3e50;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button<PageButtonProps>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => (props.active ? '#3498db' : '#e0e0e0')};
  border-radius: 4px;
  background-color: ${props => (props.active ? '#3498db' : 'white')};
  color: ${props => (props.active ? 'white' : '#2c3e50')};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.active ? '#2980b9' : '#f0f0f0')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #219653;
  }

  i {
    font-size: 1.2rem;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingIndicator = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const ResetFiltersButton = styled.button`
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
    color: #2c3e50;
  }

  i {
    margin-right: 0.5rem;
  }
`;

// Вспомогательная функция для форматирования даты
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Вспомогательная функция для форматирования даты и времени
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<DisplayBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(10);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, startDate, endDate]);

  const fetchBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      
      // Преобразуем данные из API в формат, используемый в UI
      const displayBookings: DisplayBooking[] = response.data.bookings.map(booking => ({
        id: booking.id,
        reservationNumber: booking.id.substring(0, 8),
        checkIn: booking.startDate,
        checkOut: booking.endDate,
        roomNumber: `Номер ${booking.roomId}`,
        roomType: 'Стандарт', // Здесь должна быть логика получения типа комнаты
        guestName: 'Гость', // Здесь должно быть имя гостя из booking.userId
        guestEmail: 'guest@example.com', // Здесь должен быть email гостя
        guestPhone: '+7 (XXX) XXX-XX-XX', // Здесь должен быть телефон гостя
        totalAmount: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
        notes: booking.specialRequests
      }));
      
      setBookings(displayBookings);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке бронирований:', err);
      setError('Произошла ошибка при загрузке списка бронирований');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus): Promise<void> => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      
      // Обновляем состояние после успешного запроса
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      
      // Здесь можно добавить оповещение об успешном обновлении
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
      // Здесь можно добавить оповещение об ошибке
    }
  };

  const filterBookings = (): void => {
    let filtered = [...bookings];
    
    // Применяем фильтр поиска
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomNumber.includes(searchTerm)
      );
    }
    
    // Применяем фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Применяем фильтр по диапазону дат
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      filtered = filtered.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        return checkIn >= start && checkIn <= end;
      });
    }
    
    setFilteredBookings(filtered);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };

  const exportToCSV = (): void => {
    // Получаем текущие отфильтрованные бронирования
    const dataToExport = filteredBookings;
    
    // Создаем заголовок CSV
    const header = [
      'Номер брони',
      'Заезд',
      'Выезд',
      'Номер',
      'Гость',
      'Email',
      'Телефон',
      'Сумма',
      'Статус',
      'Создано'
    ].join(',');
    
    // Создаем строки CSV
    const rows = dataToExport.map(booking => [
      booking.reservationNumber,
      booking.checkIn,
      booking.checkOut,
      `${booking.roomNumber} (${booking.roomType})`,
      booking.guestName,
      booking.guestEmail,
      booking.guestPhone,
      booking.totalAmount,
      booking.status,
      booking.createdAt
    ].join(','));
    
    // Объединяем заголовок и строки
    const csvContent = [header, ...rows].join('\n');
    
    // Создаем blob и скачиваем
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `бронирования-экспорт-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Получаем бронирования для текущей страницы
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Функция для изменения страницы
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Бронирования</PageTitle>
        <ExportButton onClick={exportToCSV}>
          <i className="fas fa-download"></i>
          Экспорт CSV
        </ExportButton>
      </PageHeader>

      <FilterContainer>
        <SearchInput>
          <input
            type="text"
            placeholder="Поиск по номеру, имени гостя или email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </SearchInput>

        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Все статусы</option>
          <option value="pending">Ожидание</option>
          <option value="confirmed">Подтверждено</option>
          <option value="cancelled">Отменено</option>
          <option value="completed">Завершено</option>
        </FilterSelect>

        <DateRangeFilter>
          <i className="fas fa-calendar-alt"></i>
          <input
            type="date"
            placeholder="Дата с"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <span>—</span>
          <input
            type="date"
            placeholder="Дата по"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </DateRangeFilter>

        <ResetFiltersButton
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setStartDate('');
            setEndDate('');
          }}
        >
          <i className="fas fa-undo"></i>
          Сбросить фильтры
        </ResetFiltersButton>
      </FilterContainer>

      {loading ? (
        <LoadingWrapper>
          <LoadingIndicator>Загрузка бронирований...</LoadingIndicator>
        </LoadingWrapper>
      ) : error ? (
        <NoResults>
          {error}
          <br />
          <button onClick={fetchBookings}>Попробовать снова</button>
        </NoResults>
      ) : currentBookings.length === 0 ? (
        <NoResults>
          Бронирования не найдены. Попробуйте изменить параметры фильтрации.
        </NoResults>
      ) : (
        <>
          <BookingsTable>
            <TableHead>
              <tr>
                <th>ID</th>
                <th>Гость</th>
                <th>Номер</th>
                <th>Даты</th>
                <th>Тип</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Создано</th>
                <th>Действия</th>
              </tr>
            </TableHead>
            <TableBody>
              {currentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>
                    {booking.guestName}
                    <br />
                    <small style={{ color: '#7f8c8d' }}>{booking.guestEmail}</small>
                  </td>
                  <td>{booking.roomNumber}</td>
                  <td>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    <br />
                    <small style={{ color: '#7f8c8d' }}>
                      {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                        (1000 * 60 * 60 * 24))} ночей
                    </small>
                  </td>
                  <td>{booking.roomType}</td>
                  <td>{booking.totalAmount.toLocaleString('ru-RU')} ₽</td>
                  <td>
                    <StatusSelect
                      value={booking.status}
                      onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                    >
                      <option value="pending">Ожидание</option>
                      <option value="confirmed">Подтверждено</option>
                      <option value="cancelled">Отменено</option>
                      <option value="completed">Завершено</option>
                    </StatusSelect>
                  </td>
                  <td>{formatDateTime(booking.createdAt)}</td>
                  <td>
                    <ActionLink to={`/admin/bookings/${booking.id}`}>
                      <i className="fas fa-eye"></i>
                      Просмотр
                    </ActionLink>
                  </td>
                </tr>
              ))}
            </TableBody>
          </BookingsTable>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </PageButton>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PageButton
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </PageButton>
              ))}

              <PageButton
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default BookingsPage; 