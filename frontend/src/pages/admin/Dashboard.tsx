import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { bookingService, roomService } from '../../services/api';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const DashboardCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--dark-color);
`;

interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalRooms: number;
  occupancyRate: number;
}

interface Booking {
  id: string;
  status: string;
  [key: string]: any;
}

interface Room {
  id: string;
  [key: string]: any;
}

interface BookingsResponse {
  bookings: Booking[];
}

interface RoomsResponse {
  rooms: Room[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeBookings: 0,
    totalRooms: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        const [bookingsRes, roomsRes] = await Promise.all([
          bookingService.getAllBookings(),
          roomService.getRooms(),
        ]);

        const bookingsData = bookingsRes.data as BookingsResponse;
        const roomsData = roomsRes.data as RoomsResponse;

        const activeBookings = bookingsData.bookings.filter(booking => booking.status === 'active');

        setStats({
          totalBookings: bookingsData.bookings.length,
          activeBookings: activeBookings.length,
          totalRooms: roomsData.rooms.length,
          occupancyRate:
            roomsData.rooms.length > 0
              ? Math.round((activeBookings.length / roomsData.rooms.length) * 100)
              : 0,
        });
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardContainer>
      <h1>Панель управления</h1>
      <DashboardGrid>
        <DashboardCard>
          <CardTitle>Всего бронирований</CardTitle>
          <CardValue>{stats.totalBookings}</CardValue>
        </DashboardCard>
        <DashboardCard>
          <CardTitle>Активные бронирования</CardTitle>
          <CardValue>{stats.activeBookings}</CardValue>
        </DashboardCard>
        <DashboardCard>
          <CardTitle>Всего номеров</CardTitle>
          <CardValue>{stats.totalRooms}</CardValue>
        </DashboardCard>
        <DashboardCard>
          <CardTitle>Загруженность</CardTitle>
          <CardValue>{stats.occupancyRate}%</CardValue>
        </DashboardCard>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 