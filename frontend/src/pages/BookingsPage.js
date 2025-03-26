import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { bookingService } from '../services/api';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const BookingList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const BookingCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--light-color);
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const BookingNumber = styled.div`
  font-weight: 600;

  span {
    color: var(--primary-color);
  }
`;

const BookingStatus = styled.div`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background-color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return 'rgba(33, 113, 72, 0.1)';
      case 'pending':
        return 'rgba(255, 193, 7, 0.1)';
      case 'cancelled':
        return 'rgba(220, 53, 69, 0.1)';
      default:
        return 'rgba(13, 110, 253, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return 'var(--success-color)';
      case 'pending':
        return 'var(--warning-color)';
      case 'cancelled':
        return 'var(--danger-color)';
      default:
        return 'var(--primary-color)';
    }
  }};
`;

const BookingBody = styled.div`
  padding: 1.5rem;
`;

const BookingInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const RoomInfo = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const RoomImage = styled.div`
  flex: 0 0 150px;
  height: 100px;
  border-radius: var(--radius-sm);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RoomDetails = styled.div`
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

const BookingDetails = styled.div`
  h4 {
    font-size: 1rem;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;

  span:first-child {
    width: 120px;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  span:last-child {
    font-weight: 500;
  }
`;

const BookingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const BookingPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const BookingActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 576px) {
    width: 100%;

    a,
    button {
      flex: 1;
    }
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.2rem;
  background-color: ${props => (props.primary ? 'var(--primary-color)' : 'white')};
  color: ${props => (props.primary ? 'white' : 'var(--danger-color)')};
  border: 1px solid ${props => (props.primary ? 'var(--primary-color)' : 'var(--danger-color)')};
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props =>
      props.primary ? 'var(--accent-color)' : 'rgba(220, 53, 69, 0.1)'};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: var(--border-color);
    border-color: var(--border-color);
    color: var(--text-muted);
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkButton = styled(Link)`
  padding: 0.7rem 1.2rem;
  background-color: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: var(--transition);

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);

  i {
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-muted);
  }
`;

const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-sm);
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return 'rgba(33, 113, 72, 0.1)';
      case 'error':
        return 'rgba(220, 53, 69, 0.1)';
      case 'warning':
        return 'rgba(255, 193, 7, 0.1)';
      default:
        return 'rgba(13, 110, 253, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return 'var(--success-color)';
      case 'error':
        return 'var(--danger-color)';
      case 'warning':
        return 'var(--warning-color)';
      default:
        return 'var(--primary-color)';
    }
  }};
  display: flex;
  align-items: center;

  i {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;

  i {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
`;

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  // Загрузка бронирований пользователя
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getUserBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
        setError('Не удалось загрузить ваши бронирования. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Функция для отмены бронирования
  const handleCancelBooking = async bookingId => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      try {
        await bookingService.cancelBooking(bookingId);

        // Обновляем состояние бронирований
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
          )
        );

        setStatus({
          type: 'success',
          message: 'Бронирование успешно отменено',
        });

        // Сбросить статус через 5 секунд
        setTimeout(() => {
          setStatus(null);
        }, 5000);
      } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        setStatus({
          type: 'error',
          message: 'Не удалось отменить бронирование. Пожалуйста, попробуйте позже.',
        });
      }
    }
  };

  // Перевод статуса бронирования на русский
  const getStatusLabel = status => {
    const statuses = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждено',
      cancelled: 'Отменено',
      completed: 'Завершено',
    };

    return statuses[status] || status;
  };

  // Отображение даты в нужном формате
  const formatDate = dateString => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Перевод типа номера на русский
  const getRoomTypeName = type => {
    const types = {
      standard: 'Стандартный',
      deluxe: 'Делюкс',
      suite: 'Люкс',
      family: 'Семейный',
      penthouse: 'Пентхаус',
      economy: 'Эконом',
    };

    return types[type] || type;
  };

  // Если загрузка еще идет, показываем индикатор загрузки
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Мои бронирования</PageTitle>
          <PageSubtitle>История и детали ваших бронирований</PageSubtitle>
        </PageHeader>

        <LoadingState>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Загрузка бронирований...</p>
        </LoadingState>
      </PageContainer>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Мои бронирования</PageTitle>
          <PageSubtitle>История и детали ваших бронирований</PageSubtitle>
        </PageHeader>

        <Alert type="error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </Alert>
      </PageContainer>
    );
  }

  // Если у пользователя нет бронирований, показываем пустое состояние
  if (bookings.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Мои бронирования</PageTitle>
          <PageSubtitle>История и детали ваших бронирований</PageSubtitle>
        </PageHeader>

        <EmptyState>
          <i className="fas fa-calendar-alt"></i>
          <h3>У вас пока нет бронирований</h3>
          <p>Забронируйте номер прямо сейчас и наслаждайтесь отдыхом в "Лесном Дворике"</p>
          <LinkButton to="/booking">Забронировать номер</LinkButton>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Мои бронирования</PageTitle>
        <PageSubtitle>История и детали ваших бронирований</PageSubtitle>
      </PageHeader>

      {status && (
        <Alert type={status.type}>
          <i
            className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}
          ></i>
          {status.message}
        </Alert>
      )}

      <BookingList>
        {bookings.map(booking => (
          <BookingCard key={booking._id}>
            <BookingHeader>
              <BookingNumber>
                Бронирование{' '}
                <span>#{booking.bookingNumber || 'БН-' + booking._id.substring(0, 8)}</span>
              </BookingNumber>
              <BookingStatus status={booking.status}>
                {getStatusLabel(booking.status)}
              </BookingStatus>
            </BookingHeader>

            <BookingBody>
              <BookingInfo>
                <RoomInfo>
                  <RoomImage>
                    <img
                      src={
                        booking.room?.images && booking.room.images.length > 0
                          ? booking.room.images[0]
                          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
                      }
                      alt={booking.room?.name || 'Номер'}
                    />
                  </RoomImage>
                  <RoomDetails>
                    <h3>{booking.room?.name || 'Номер'}</h3>
                    <p>
                      {booking.room
                        ? getRoomTypeName(booking.room.roomType)
                        : 'Информация о номере недоступна'}
                    </p>
                    <p>
                      <i className="fas fa-user"></i> {booking.adults} взр.
                      {booking.children > 0 && ` + ${booking.children} дет.`}
                    </p>
                  </RoomDetails>
                </RoomInfo>

                <BookingDetails>
                  <h4>Информация о бронировании</h4>
                  <DetailItem>
                    <span>Заезд:</span>
                    <span>{formatDate(booking.checkIn)}</span>
                  </DetailItem>
                  <DetailItem>
                    <span>Выезд:</span>
                    <span>{formatDate(booking.checkOut)}</span>
                  </DetailItem>
                  <DetailItem>
                    <span>Количество ночей:</span>
                    <span>
                      {Math.ceil(
                        (new Date(booking.checkOut) - new Date(booking.checkIn)) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </DetailItem>
                  <DetailItem>
                    <span>Дата создания:</span>
                    <span>{formatDate(booking.createdAt)}</span>
                  </DetailItem>
                </BookingDetails>
              </BookingInfo>

              <BookingFooter>
                <BookingPrice>
                  {booking.totalPrice
                    ? `${booking.totalPrice.toLocaleString()} ₽`
                    : booking.room
                      ? `${booking.room.price.toLocaleString()} ₽ за ночь`
                      : 'Цена недоступна'}
                </BookingPrice>

                <BookingActions>
                  <LinkButton to={`/bookings/${booking._id}`}>Подробнее</LinkButton>
                  <Button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                  >
                    Отменить
                  </Button>
                </BookingActions>
              </BookingFooter>
            </BookingBody>
          </BookingCard>
        ))}
      </BookingList>
    </PageContainer>
  );
};

export default BookingsPage;
