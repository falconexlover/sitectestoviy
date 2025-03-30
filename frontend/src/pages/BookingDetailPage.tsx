import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { bookingService } from '../services/api';

// Интерфейсы
interface GuestInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface Room {
  _id: string;
  name: string;
  roomType: string;
  price: number;
  capacity: number;
  beds: string;
  area: number;
  images?: string[];
}

interface Booking {
  _id: string;
  bookingNumber?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  room?: Room;
  guestInfo?: GuestInfo;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
}

interface StatusMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
}

interface BookingStatusProps {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
}

// Стилизованные компоненты
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

const BookingDetailContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const BookingInfoCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
`;

const BookingHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--light-color);
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const BookingNumber = styled.div`
  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
`;

const BookingStatus = styled.div<BookingStatusProps>`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
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

const BookingContent = styled.div`
  padding: 1.5rem;
`;

const BookingSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: var(--accent-color);
  }
`;

const RoomInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const RoomImage = styled.div`
  flex: 0 0 250px;
  height: 180px;
  border-radius: var(--radius-sm);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 576px) {
    flex: 0 0 auto;
  }
`;

const RoomDetails = styled.div`
  flex: 1;

  h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

const RoomFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const RoomFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: var(--primary-color);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const DetailGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--dark-color);
`;

const DetailValue = styled.div`
  color: var(--text-color);
`;

const GuestInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const PriceSummary = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  &.total {
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--border-color);
  }
`;

const QrCode = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;

  img {
    max-width: 200px;
    height: auto;
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button<ButtonProps>`
  padding: 0.8rem 1.5rem;
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

interface LinkButtonProps {
  to: string;
  secondary?: boolean;
}

const LinkButton = styled(Link)<LinkButtonProps>`
  padding: 0.8rem 1.5rem;
  background-color: ${props => (props.secondary ? 'white' : 'var(--primary-color)')};
  color: ${props => (props.secondary ? 'var(--dark-color)' : 'white')};
  border: 1px solid ${props => (props.secondary ? 'var(--border-color)' : 'var(--primary-color)')};
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: var(--transition);

  &:hover {
    background-color: ${props => (props.secondary ? 'var(--light-color)' : 'var(--accent-color)')};
    transform: translateY(-2px);
  }
`;

const Alert = styled.div<AlertProps>`
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

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  // Загрузка информации о бронировании
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getBookingById(id || '');
        // Используем приведение типа, чтобы указать TypeScript, 
        // что данные соответствуют интерфейсу Booking
        const bookingData = response.data.booking as unknown as Booking;
        setBooking(bookingData || null);
      } catch (error) {
        console.error('Ошибка при загрузке информации о бронировании:', error);
        setError('Не удалось загрузить информацию о бронировании. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  // Функция для отмены бронирования
  const handleCancelBooking = async () => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      try {
        await bookingService.cancelBooking(id || '');

        // Обновляем статус бронирования
        setBooking(prevBooking => prevBooking ? ({ ...prevBooking, status: 'cancelled' }) : null);

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
  const getStatusLabel = (status: string): string => {
    const statuses: Record<string, string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждено',
      cancelled: 'Отменено',
      completed: 'Завершено',
    };

    return statuses[status] || status;
  };

  // Отображение даты в нужном формате
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Отображение времени в нужном формате
  const formatTime = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('ru-RU', options);
  };

  // Отображение полной даты и времени
  const formatDateTime = (dateString: string): string => {
    return `${formatDate(dateString)}, ${formatTime(dateString)}`;
  };

  // Перевод типа номера на русский
  const getRoomTypeName = (type: string): string => {
    const types: Record<string, string> = {
      standard: 'Стандартный',
      deluxe: 'Делюкс',
      suite: 'Люкс',
      family: 'Семейный',
      penthouse: 'Пентхаус',
      economy: 'Эконом',
    };

    return types[type] || type;
  };

  // Подсчёт количества ночей
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Если загрузка еще идет, показываем индикатор загрузки
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Детали бронирования</PageTitle>
          <PageSubtitle>Информация о вашем бронировании</PageSubtitle>
        </PageHeader>

        <LoadingState>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Загрузка информации о бронировании...</p>
        </LoadingState>
      </PageContainer>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Детали бронирования</PageTitle>
          <PageSubtitle>Информация о вашем бронировании</PageSubtitle>
        </PageHeader>

        <Alert type="error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </Alert>

        <ButtonContainer>
          <LinkButton to="/bookings" secondary>
            Вернуться к бронированиям
          </LinkButton>
        </ButtonContainer>
      </PageContainer>
    );
  }

  // Если бронирование не найдено
  if (!booking) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Детали бронирования</PageTitle>
          <PageSubtitle>Информация о вашем бронировании</PageSubtitle>
        </PageHeader>

        <Alert type="error">
          <i className="fas fa-exclamation-circle"></i>
          Бронирование не найдено
        </Alert>

        <ButtonContainer>
          <LinkButton to="/bookings" secondary>
            Вернуться к бронированиям
          </LinkButton>
        </ButtonContainer>
      </PageContainer>
    );
  }

  // Вычисляем количество ночей
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  // Вычисляем общую стоимость
  const roomPrice = booking.room?.price || 0;
  const totalPrice = booking.totalPrice || roomPrice * nights;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Детали бронирования</PageTitle>
        <PageSubtitle>Информация о вашем бронировании</PageSubtitle>
      </PageHeader>

      {status && (
        <Alert type={status.type}>
          <i
            className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}
          ></i>
          {status.message}
        </Alert>
      )}

      <BookingDetailContainer>
        <div>
          <BookingInfoCard>
            <BookingHeader>
              <BookingNumber>
                <h2>
                  Бронирование #{booking.bookingNumber || 'БН-' + booking._id.substring(0, 8)}
                </h2>
                <p>Создано: {formatDateTime(booking.createdAt)}</p>
              </BookingNumber>
              <BookingStatus status={booking.status}>
                {getStatusLabel(booking.status)}
              </BookingStatus>
            </BookingHeader>

            <BookingContent>
              <BookingSection>
                <SectionTitle>Информация о номере</SectionTitle>
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
                    <h4>{booking.room?.name || 'Номер'}</h4>
                    <p>
                      {booking.room
                        ? getRoomTypeName(booking.room.roomType)
                        : 'Информация о номере недоступна'}
                    </p>

                    <RoomFeatures>
                      <RoomFeature>
                        <i className="fas fa-user"></i>
                        <span>Вместимость: {booking.room?.capacity || 2} чел.</span>
                      </RoomFeature>
                      <RoomFeature>
                        <i className="fas fa-bed"></i>
                        <span>{booking.room?.beds || 'Кровать'}</span>
                      </RoomFeature>
                      <RoomFeature>
                        <i className="fas fa-expand"></i>
                        <span>{booking.room?.area || '25'} м²</span>
                      </RoomFeature>
                    </RoomFeatures>

                    {booking.room && (
                      <p style={{ marginTop: '1rem' }}>
                        <strong>Стоимость за ночь:</strong> {booking.room.price.toLocaleString()} ₽
                      </p>
                    )}
                  </RoomDetails>
                </RoomInfo>
              </BookingSection>

              <BookingSection>
                <SectionTitle>Детали бронирования</SectionTitle>
                <DetailGrid>
                  <div>
                    <DetailGroup>
                      <DetailLabel>Даты проживания</DetailLabel>
                      <DetailValue>
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </DetailValue>
                    </DetailGroup>
                    <DetailGroup>
                      <DetailLabel>Количество ночей</DetailLabel>
                      <DetailValue>{nights}</DetailValue>
                    </DetailGroup>
                    <DetailGroup>
                      <DetailLabel>Количество гостей</DetailLabel>
                      <DetailValue>
                        {booking.adults} взрослых
                        {booking.children > 0 && `, ${booking.children} детей`}
                      </DetailValue>
                    </DetailGroup>
                  </div>
                  <div>
                    <DetailGroup>
                      <DetailLabel>Время заезда</DetailLabel>
                      <DetailValue>с 14:00</DetailValue>
                    </DetailGroup>
                    <DetailGroup>
                      <DetailLabel>Время выезда</DetailLabel>
                      <DetailValue>до 12:00</DetailValue>
                    </DetailGroup>
                    {booking.specialRequests && (
                      <DetailGroup>
                        <DetailLabel>Особые пожелания</DetailLabel>
                        <DetailValue>{booking.specialRequests}</DetailValue>
                      </DetailGroup>
                    )}
                  </div>
                </DetailGrid>
              </BookingSection>

              <BookingSection>
                <SectionTitle>Информация о госте</SectionTitle>
                <GuestInfo>
                  <div>
                    <DetailGroup>
                      <DetailLabel>Имя</DetailLabel>
                      <DetailValue>{booking.guestInfo?.firstName || 'Не указано'}</DetailValue>
                    </DetailGroup>
                    <DetailGroup>
                      <DetailLabel>Фамилия</DetailLabel>
                      <DetailValue>{booking.guestInfo?.lastName || 'Не указано'}</DetailValue>
                    </DetailGroup>
                  </div>
                  <div>
                    <DetailGroup>
                      <DetailLabel>Email</DetailLabel>
                      <DetailValue>{booking.guestInfo?.email || 'Не указано'}</DetailValue>
                    </DetailGroup>
                    <DetailGroup>
                      <DetailLabel>Телефон</DetailLabel>
                      <DetailValue>{booking.guestInfo?.phone || 'Не указано'}</DetailValue>
                    </DetailGroup>
                  </div>
                </GuestInfo>
              </BookingSection>
            </BookingContent>
          </BookingInfoCard>

          <ButtonContainer>
            <LinkButton to="/bookings" secondary>
              Вернуться к бронированиям
            </LinkButton>
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <Button onClick={handleCancelBooking}>Отменить бронирование</Button>
            )}
          </ButtonContainer>
        </div>

        <div>
          <PriceSummary>
            <SectionTitle>Детали оплаты</SectionTitle>
            <PriceRow>
              <span>Стоимость номера ({nights} ночей)</span>
              <span>{(roomPrice * nights).toLocaleString()} ₽</span>
            </PriceRow>
            <PriceRow>
              <span>Сервисный сбор</span>
              <span>0 ₽</span>
            </PriceRow>
            <PriceRow>
              <span>Налог (НДС 20%)</span>
              <span>{Math.round(totalPrice - totalPrice / 1.2).toLocaleString()} ₽</span>
            </PriceRow>
            <PriceRow className="total">
              <span>Итого</span>
              <span>{totalPrice.toLocaleString()} ₽</span>
            </PriceRow>

            <div style={{ marginTop: '1.5rem' }}>
              <DetailGroup>
                <DetailLabel>Способ оплаты</DetailLabel>
                <DetailValue>При заселении</DetailValue>
              </DetailGroup>
              <DetailGroup>
                <DetailLabel>Статус оплаты</DetailLabel>
                <DetailValue>Ожидает оплаты</DetailValue>
              </DetailGroup>
            </div>
          </PriceSummary>

          <QrCode>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOOKING:${booking._id}`}
              alt="QR-код бронирования"
            />
            <h4>QR-код вашего бронирования</h4>
            <p>Предъявите этот код при заселении для быстрой регистрации</p>
          </QrCode>
        </div>
      </BookingDetailContainer>
    </PageContainer>
  );
};

export default BookingDetailPage; 