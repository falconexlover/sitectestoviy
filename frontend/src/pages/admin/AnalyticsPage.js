import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import analyticsService from '../../services/analyticsService';

// Регистрируем все компоненты Chart.js
ChartJS.register(...registerables);

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
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

const DateFilterWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
  display: block;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const ApplyButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-end;

  &:hover {
    background-color: #2980b9;
  }

  i {
    font-size: 1rem;
  }
`;

const DownloadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
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
    font-size: 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
  i {
    font-size: 2rem;
    color: #3498db;
    margin-bottom: 1rem;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
`;

const StatChange = styled.div`
  font-size: 0.9rem;
  margin-top: auto;
  padding-top: 1rem;
  color: ${props => props.positive ? '#27ae60' : '#e74c3c'};
  display: flex;
  align-items: center;
  
  i {
    font-size: 1rem;
    margin-right: 0.25rem;
    margin-bottom: 0;
  }
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SegmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingIndicator = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  i {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #e0e0e0;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f0f0f0;
    
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [stats, setStats] = useState({
    revenue: 0,
    revenueChange: 0,
    bookings: 0,
    bookingsChange: 0,
    occupancy: 0,
    occupancyChange: 0,
    averageRate: 0,
    averageRateChange: 0
  });
  
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  
  const [bookingsData, setBookingsData] = useState({
    labels: [],
    datasets: []
  });
  
  const [occupancyData, setOccupancyData] = useState({
    labels: [],
    datasets: []
  });
  
  const [roomTypeData, setRoomTypeData] = useState({
    labels: [],
    datasets: []
  });
  
  const [sourceData, setSourceData] = useState({
    labels: [],
    datasets: []
  });
  
  const [popularRooms, setPopularRooms] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);
  
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Получаем общую статистику
      const overallStats = await analyticsService.getOverallStats();
      
      // Получаем данные по выручке и бронированиям
      const periodStats = await analyticsService.getStatsByPeriod(timeframe);
      
      // Получаем данные по загрузке
      const occupancyStats = await analyticsService.getOccupancyForecast();
      
      // Получаем данные по популярным номерам
      const popularRoomsData = await analyticsService.getPopularRooms();
      
      // Получаем статистику по типам номеров
      const roomTypeStats = await analyticsService.getRoomTypeStats();
      
      // Получаем статистику по источникам бронирований
      const sourceStats = await analyticsService.getBookingSourceStats();
      
      // Обрабатываем полученные данные
      processData(
        overallStats.data, 
        periodStats.data, 
        occupancyStats.data,
        popularRoomsData.data,
        roomTypeStats.data,
        sourceStats.data
      );
      
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке аналитических данных:', error);
      setError('Произошла ошибка при загрузке аналитических данных');
    } finally {
      setLoading(false);
    }
  };
  
  const processData = (overall, periodStats, occupancyStats, popularRoomsData, roomTypeStats, sourceStats) => {
    // Устанавливаем общую статистику
    setStats({
      revenue: overall.revenue,
      revenueChange: overall.revenueChange,
      bookings: overall.bookings,
      bookingsChange: overall.bookingsChange,
      occupancy: overall.occupancy,
      occupancyChange: overall.occupancyChange,
      averageRate: overall.averageRate,
      averageRateChange: overall.averageRateChange
    });
    
    // Подготавливаем данные для графика выручки
    setRevenueData({
      labels: periodStats.labels,
      datasets: [
        {
          label: 'Выручка',
          data: periodStats.revenue,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    });
    
    // Подготавливаем данные для графика бронирований
    setBookingsData({
      labels: periodStats.labels,
      datasets: [
        {
          label: 'Бронирования',
          data: periodStats.bookings,
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    });
    
    // Подготавливаем данные для графика загрузки
    setOccupancyData({
      labels: occupancyStats.labels,
      datasets: [
        {
          label: 'Загрузка (%)',
          data: occupancyStats.occupancy,
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    });
    
    // Устанавливаем данные по популярным номерам
    setPopularRooms(popularRoomsData);
    
    // Подготавливаем данные для графика по типам номеров
    setRoomTypeData({
      labels: roomTypeStats.labels,
      datasets: [
        {
          data: roomTypeStats.values,
          backgroundColor: [
            '#3498db',
            '#2ecc71',
            '#f1c40f',
            '#e74c3c',
            '#9b59b6',
            '#1abc9c'
          ],
          borderWidth: 0
        }
      ]
    });
    
    // Подготавливаем данные для графика по источникам бронирований
    setSourceData({
      labels: sourceStats.labels,
      datasets: [
        {
          data: sourceStats.values,
          backgroundColor: [
            '#3498db',
            '#2ecc71',
            '#f1c40f',
            '#e74c3c',
            '#9b59b6'
          ],
          borderWidth: 0
        }
      ]
    });
  };
  
  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };
  
  const handleApplyFilters = () => {
    fetchAnalyticsData();
  };
  
  const handleDownloadReport = () => {
    // Логика для скачивания отчёта в формате PDF или Excel
    alert('Скачивание отчета в разработке');
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Аналитика</PageTitle>
        </PageHeader>
        <LoadingWrapper>
          <LoadingIndicator>Загрузка аналитических данных...</LoadingIndicator>
        </LoadingWrapper>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Аналитика</PageTitle>
        </PageHeader>
        <ErrorMessage>
          <i className="fas fa-exclamation-circle"></i>
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <RetryButton onClick={fetchAnalyticsData}>Повторить запрос</RetryButton>
        </ErrorMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Аналитика</PageTitle>
        <DownloadButton onClick={handleDownloadReport}>
          <i className="fas fa-file-download"></i> Скачать отчёт
        </DownloadButton>
      </PageHeader>
      
      <FilterContainer>
        <div>
          <FilterLabel>Период</FilterLabel>
          <FilterSelect value={timeframe} onChange={handleTimeframeChange}>
            <option value="day">День</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
            <option value="custom">Произвольный период</option>
          </FilterSelect>
        </div>
        
        {timeframe === 'custom' && (
          <DateFilterWrapper>
            <div>
              <FilterLabel>С</FilterLabel>
              <DateInput 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <FilterLabel>По</FilterLabel>
              <DateInput 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </DateFilterWrapper>
        )}
        
        <ApplyButton onClick={handleApplyFilters}>
          <i className="fas fa-filter"></i> Применить
        </ApplyButton>
      </FilterContainer>
      
      <StatsGrid>
        <StatCard>
          <i className="fas fa-money-bill-wave"></i>
          <StatValue>{formatCurrency(stats.revenue)}</StatValue>
          <StatLabel>Общая выручка</StatLabel>
          <StatChange positive={stats.revenueChange >= 0}>
            <i className={`fas fa-${stats.revenueChange >= 0 ? 'arrow-up' : 'arrow-down'}`}></i>
            {formatPercent(Math.abs(stats.revenueChange))}
          </StatChange>
        </StatCard>
        
        <StatCard>
          <i className="fas fa-calendar-check"></i>
          <StatValue>{stats.bookings}</StatValue>
          <StatLabel>Количество бронирований</StatLabel>
          <StatChange positive={stats.bookingsChange >= 0}>
            <i className={`fas fa-${stats.bookingsChange >= 0 ? 'arrow-up' : 'arrow-down'}`}></i>
            {formatPercent(Math.abs(stats.bookingsChange))}
          </StatChange>
        </StatCard>
        
        <StatCard>
          <i className="fas fa-bed"></i>
          <StatValue>{formatPercent(stats.occupancy)}</StatValue>
          <StatLabel>Средняя загрузка</StatLabel>
          <StatChange positive={stats.occupancyChange >= 0}>
            <i className={`fas fa-${stats.occupancyChange >= 0 ? 'arrow-up' : 'arrow-down'}`}></i>
            {formatPercent(Math.abs(stats.occupancyChange))}
          </StatChange>
        </StatCard>
        
        <StatCard>
          <i className="fas fa-tag"></i>
          <StatValue>{formatCurrency(stats.averageRate)}</StatValue>
          <StatLabel>Средняя цена за ночь</StatLabel>
          <StatChange positive={stats.averageRateChange >= 0}>
            <i className={`fas fa-${stats.averageRateChange >= 0 ? 'arrow-up' : 'arrow-down'}`}></i>
            {formatPercent(Math.abs(stats.averageRateChange))}
          </StatChange>
        </StatCard>
      </StatsGrid>
      
      <ChartGrid>
        <ChartContainer>
          <ChartTitle>Динамика выручки</ChartTitle>
          <Line 
            data={revenueData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return formatCurrency(context.parsed.y);
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return formatCurrency(value);
                    }
                  }
                }
              }
            }}
          />
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Динамика бронирований</ChartTitle>
          <Bar 
            data={bookingsData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }}
          />
        </ChartContainer>
      </ChartGrid>
      
      <ChartContainer>
        <ChartTitle>Прогноз загрузки</ChartTitle>
        <Line 
          data={occupancyData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                align: 'end'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y.toFixed(1)}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return `${value}%`;
                  }
                }
              }
            }
          }}
        />
      </ChartContainer>
      
      <SegmentGrid>
        <ChartContainer>
          <ChartTitle>Распределение по типам номеров</ChartTitle>
          <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie 
              data={roomTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                        const percentage = ((value * 100) / total).toFixed(1);
                        return `${label}: ${percentage}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Источники бронирований</ChartTitle>
          <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie 
              data={sourceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                        const percentage = ((value * 100) / total).toFixed(1);
                        return `${label}: ${percentage}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </ChartContainer>
      </SegmentGrid>
      
      <ChartContainer>
        <ChartTitle>Самые популярные номера</ChartTitle>
        <Table>
          <TableHead>
            <tr>
              <th>Номер</th>
              <th>Тип</th>
              <th>Кол-во бронирований</th>
              <th>Общая выручка</th>
              <th>Загрузка</th>
            </tr>
          </TableHead>
          <TableBody>
            {popularRooms.map((room, index) => (
              <tr key={index}>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.bookings}</td>
                <td>{formatCurrency(room.revenue)}</td>
                <td>{formatPercent(room.occupancy)}</td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </ChartContainer>
    </PageContainer>
  );
};

export default AnalyticsPage; 