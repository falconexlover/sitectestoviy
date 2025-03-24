import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import analyticsService from '../../services/analyticsService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.bgColor || '#fff'};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.textColor || '#2c3e50'};
  margin-bottom: 0.5rem;
`;

const StatInfo = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: auto;
`;

const ChartContainer = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  height: 300px;
  position: relative;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
`;

const ChartOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChartOption = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background: ${props => props.active ? '#3498db' : '#fff'};
  color: ${props => props.active ? '#fff' : '#7f8c8d'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2980b9' : '#f9f9f9'};
  }
`;

const ChartPlaceholder = styled.div`
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #95a5a6;
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TableContainer = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TableTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
`;

const ViewAll = styled(Link)`
  font-size: 0.9rem;
  color: #3498db;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 2px solid #f0f0f0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeadCell = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const TableCell = styled.td`
  padding: 0.75rem 0.5rem;
  color: #2c3e50;
  font-size: 0.9rem;
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

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  color: #e53935;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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

const DashboardPage = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  
  const [stats, setStats] = useState({
    revenue: 0,
    bookings: 0,
    occupancy: 0,
    averageRating: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  
  const [chartTimeframe, setChartTimeframe] = useState('week');

  useEffect(() => {
    // Загрузка последних бронирований
    const fetchRecentBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await bookingService.getAllBookings();
        const sortedBookings = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        setRecentBookings(sortedBookings);
        setBookingsError(null);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
        setBookingsError('Не удалось загрузить последние бронирования');
      } finally {
        setBookingsLoading(false);
      }
    };

    // Загрузка общей статистики
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await analyticsService.getOverallStats();
        setStats({
          revenue: response.data.totalRevenue || 0,
          bookings: response.data.totalBookings || 0,
          occupancy: response.data.occupancyRate || 0,
          averageRating: response.data.averageRating || 0
        });
        setStatsError(null);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
        setStatsError('Не удалось загрузить статистику');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchRecentBookings();
    fetchStats();
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Панель управления</PageTitle>
        <PageSubtitle>Обзор работы отеля "Лесной дворик"</PageSubtitle>
      </PageHeader>

      {/* Статистика */}
      <StatsGrid>
        <StatCard bgColor="#f0f9ff">
          <StatTitle>Выручка за месяц</StatTitle>
          {statsLoading ? (
            <StatValue>—</StatValue>
          ) : statsError ? (
            <StatValue textColor="#e53935">Ошибка</StatValue>
          ) : (
            <StatValue textColor="#3498db">{stats.revenue.toLocaleString('ru-RU')} ₽</StatValue>
          )}
          <StatInfo>За последние 30 дней</StatInfo>
        </StatCard>

        <StatCard bgColor="#fef9e7">
          <StatTitle>Новые бронирования</StatTitle>
          {statsLoading ? (
            <StatValue>—</StatValue>
          ) : statsError ? (
            <StatValue textColor="#e53935">Ошибка</StatValue>
          ) : (
            <StatValue textColor="#f39c12">{stats.bookings}</StatValue>
          )}
          <StatInfo>За последние 30 дней</StatInfo>
        </StatCard>

        <StatCard bgColor="#eef7ed">
          <StatTitle>Заполняемость</StatTitle>
          {statsLoading ? (
            <StatValue>—</StatValue>
          ) : statsError ? (
            <StatValue textColor="#e53935">Ошибка</StatValue>
          ) : (
            <StatValue textColor="#27ae60">{stats.occupancy}%</StatValue>
          )}
          <StatInfo>Средняя за последний месяц</StatInfo>
        </StatCard>

        <StatCard bgColor="#fff5f5">
          <StatTitle>Средний рейтинг</StatTitle>
          {statsLoading ? (
            <StatValue>—</StatValue>
          ) : statsError ? (
            <StatValue textColor="#e53935">Ошибка</StatValue>
          ) : (
            <StatValue textColor="#e74c3c">{stats.averageRating.toFixed(1)}/5.0</StatValue>
          )}
          <StatInfo>Основан на 214 отзывах</StatInfo>
        </StatCard>
      </StatsGrid>

      {/* График */}
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Выручка и бронирования</ChartTitle>
          <ChartOptions>
            <ChartOption 
              active={chartTimeframe === 'week'} 
              onClick={() => setChartTimeframe('week')}
            >
              Неделя
            </ChartOption>
            <ChartOption 
              active={chartTimeframe === 'month'} 
              onClick={() => setChartTimeframe('month')}
            >
              Месяц
            </ChartOption>
            <ChartOption 
              active={chartTimeframe === 'year'} 
              onClick={() => setChartTimeframe('year')}
            >
              Год
            </ChartOption>
          </ChartOptions>
        </ChartHeader>
        <ChartPlaceholder>
          [График выручки и бронирований за {
            chartTimeframe === 'week' ? 'неделю' : 
            chartTimeframe === 'month' ? 'месяц' : 'год'
          }]
        </ChartPlaceholder>
      </ChartContainer>

      {/* Таблицы */}
      <TablesGrid>
        <TableContainer>
          <TableHeader>
            <TableTitle>Последние бронирования</TableTitle>
            <ViewAll to="/admin/bookings">Все бронирования</ViewAll>
          </TableHeader>
          
          {bookingsLoading ? (
            <LoadingMessage>Загрузка бронирований...</LoadingMessage>
          ) : bookingsError ? (
            <ErrorMessage>{bookingsError}</ErrorMessage>
          ) : recentBookings.length === 0 ? (
            <LoadingMessage>Нет данных о бронированиях</LoadingMessage>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Гость</TableHeadCell>
                  <TableHeadCell>Даты</TableHeadCell>
                  <TableHeadCell>Сумма</TableHeadCell>
                  <TableHeadCell>Статус</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell>#{booking.id}</TableCell>
                    <TableCell>{booking.User?.name || 'Н/Д'}</TableCell>
                    <TableCell>
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </TableCell>
                    <TableCell>{booking.totalPrice?.toLocaleString('ru-RU')} ₽</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status}>
                        {translateStatus(booking.status)}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <TableContainer>
          <TableHeader>
            <TableTitle>Популярные номера</TableTitle>
            <ViewAll to="/admin/rooms">Все номера</ViewAll>
          </TableHeader>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Номер</TableHeadCell>
                <TableHeadCell>Тип</TableHeadCell>
                <TableHeadCell>Бронирований</TableHeadCell>
                <TableHeadCell>Рейтинг</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Люкс #101</TableCell>
                <TableCell>Люкс</TableCell>
                <TableCell>24</TableCell>
                <TableCell>4.9</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Стандарт #205</TableCell>
                <TableCell>Стандарт</TableCell>
                <TableCell>18</TableCell>
                <TableCell>4.7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Семейный #304</TableCell>
                <TableCell>Семейный</TableCell>
                <TableCell>15</TableCell>
                <TableCell>4.8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Стандарт #208</TableCell>
                <TableCell>Стандарт</TableCell>
                <TableCell>12</TableCell>
                <TableCell>4.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Бизнес #402</TableCell>
                <TableCell>Бизнес</TableCell>
                <TableCell>10</TableCell>
                <TableCell>4.6</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TablesGrid>
    </PageContainer>
  );
};

export default DashboardPage; 