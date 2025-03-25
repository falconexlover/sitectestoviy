import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';

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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'confirmed': return '#e3f7ed';
      case 'pending': return '#fff8e6';
      case 'cancelled': return '#ffebee';
      case 'completed': return '#e8f0fe';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'confirmed': return '#1d8a4e';
      case 'pending': return '#ff9800';
      case 'cancelled': return '#e53935';
      case 'completed': return '#3f51b5';
      default: return '#7f8c8d';
    }
  }};
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

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.active ? '#3498db' : '#e0e0e0'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#f0f0f0'};
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  i {
    font-size: 3rem;
    color: #95a5a6;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 1.5rem;
  }
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const translateStatus = (status) => {
  const statuses = {
    'pending': 'Ожидание',
    'confirmed': 'Подтверждено',
    'cancelled': 'Отменено',
    'completed': 'Завершено'
  };
  return statuses[status] || status;
};

const BookingStatusCell = ({ value }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'cancelled': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Завершено';
      default: return 'Неизвестно';
    }
  };

  return (
    <div style={{ 
      padding: '4px 8px', 
      borderRadius: '4px', 
      backgroundColor: getStatusColor(value), 
      color: 'white',
      display: 'inline-block',
      fontWeight: 'bold',
      fontSize: '0.85rem'
    }}>
      {getStatusText(value)}
    </div>
  );
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error);
      setError('Произошла ошибка при загрузке списка бронирований');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      
      // Обновляем состояние после успешного запроса
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      ));
      
      // Оповещение об успешном обновлении
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      // Оповещение об ошибке
    }
  };
  
  const exportToCSV = () => {
    // Функция экспорта бронирований в CSV
    const headers = ['ID', 'Гость', 'Email', 'Телефон', 'Номер', 'Даты', 'Гостей', 'Цена', 'Статус', 'Создано'];
    const rows = filteredBookings.map(booking => [
      booking.id,
      booking.User?.name || 'Н/Д',
      booking.User?.email || 'Н/Д',
      booking.User?.phone || 'Н/Д',
      booking.Room?.title || `Номер ${booking.Room?.number}` || 'Н/Д',
      `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`,
      booking.guestsCount || 'Н/Д',
      `${booking.totalPrice.toLocaleString('ru-RU')} ₽`,
      translateStatus(booking.status),
      formatDateTime(booking.createdAt)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Создаем временную ссылку для скачивания файла
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };
  
  // Фильтрация бронирований
  const filteredBookings = bookings.filter(booking => {
    // Поиск по ID, имени гостя, email или номеру комнаты
    const searchMatch = 
      booking.id.toString().includes(searchTerm) ||
      (booking.User?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.User?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.Room?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.Room?.number || '').toString().includes(searchTerm);
    
    // Фильтр по статусу
    const statusMatch = statusFilter ? booking.status === statusFilter : true;
    
    // Фильтр по датам
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    
    const startDateFilter = startDate ? new Date(startDate) : null;
    const endDateFilter = endDate ? new Date(endDate) : null;
    
    const dateMatch = (
      (!startDateFilter || checkInDate >= startDateFilter) &&
      (!endDateFilter || checkOutDate <= endDateFilter)
    );
    
    return searchMatch && statusMatch && dateMatch;
  });
  
  // Пагинация
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Управление бронированиями</PageTitle>
        <ExportButton onClick={exportToCSV}>
          <i className="fas fa-file-export"></i> Экспорт в CSV
        </ExportButton>
      </PageHeader>
      
      <FilterContainer>
        <SearchInput>
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Поиск бронирования..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        
        <FilterSelect 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="pending">Ожидание</option>
          <option value="confirmed">Подтверждено</option>
          <option value="cancelled">Отменено</option>
          <option value="completed">Завершено</option>
        </FilterSelect>
        
        <DateRangeFilter>
          <i className="fas fa-calendar-alt"></i>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Дата заезда"
          />
          <span>до</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Дата выезда"
          />
        </DateRangeFilter>
      </FilterContainer>
      
      {loading ? (
        <LoadingWrapper>
          <LoadingIndicator>Загрузка бронирований...</LoadingIndicator>
        </LoadingWrapper>
      ) : error ? (
        <NoResults>
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <RetryButton onClick={fetchBookings}>Повторить запрос</RetryButton>
        </NoResults>
      ) : currentBookings.length === 0 ? (
        <NoResults>
          <i className="fas fa-calendar-times"></i>
          <p>Бронирования не найдены</p>
          <RetryButton onClick={() => {
            setSearchTerm('');
            setStatusFilter('');
            setStartDate('');
            setEndDate('');
          }}>Сбросить фильтры</RetryButton>
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
                <th>Гостей</th>
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
                    {booking.User?.name || 'Н/Д'}
                    <br />
                    <small style={{ color: '#7f8c8d' }}>{booking.User?.email || 'Н/Д'}</small>
                  </td>
                  <td>
                    {booking.Room?.title || `Номер ${booking.Room?.number}` || 'Н/Д'}
                  </td>
                  <td>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    <br />
                    <small style={{ color: '#7f8c8d' }}>
                      {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} ночей
                    </small>
                  </td>
                  <td>{booking.guestsCount || 'Н/Д'}</td>
                  <td>{booking.totalPrice?.toLocaleString('ru-RU')} ₽</td>
                  <td>
                    <StatusSelect 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
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
                      <i className="fas fa-eye"></i> Детали
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
                <i className="fas fa-chevron-left"></i>
              </PageButton>
              
              {[...Array(totalPages).keys()].map(number => (
                <PageButton
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </PageButton>
              ))}
              
              <PageButton 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default BookingsPage; 