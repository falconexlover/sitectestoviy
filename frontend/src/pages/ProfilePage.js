import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, bookingService } from '../services/api';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const PageTitle = styled.h1`
  color: var(--dark-color);
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--light-color);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 10px;
  }
  
  @media (max-width: 576px) {
    justify-content: flex-start;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary-color);
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: var(--primary-color);
    
    &::after {
      transform: scaleX(1);
    }
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  
  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  color: var(--dark-color);
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--dark-color);
  }
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
`;

const Error = styled.div`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 1rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: var(--dark-color);
    transition: var(--transition);
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  &:hover::before {
    width: 100%;
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
`;

const LogoutButton = styled(Button)`
  background-color: var(--danger-color);
  margin-top: 1rem;
  
  &::before {
    background-color: #b71c1c;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-sm);
  background-color: ${props => {
    switch(props.type) {
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
    switch(props.type) {
      case 'success':
        return 'var(--success-color)';
      case 'error':
        return 'var(--danger-color)';
      case 'warning':
        return 'var(--warning-color)';
      default:
        return 'var(--info-color)';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'success':
        return 'var(--success-color)';
      case 'error':
        return 'var(--danger-color)';
      case 'warning':
        return 'var(--warning-color)';
      default:
        return 'var(--info-color)';
    }
  }};
`;

const BookingList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const BookingCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
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
  margin-bottom: 1rem;
`;

const BookingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  
  a {
    color: inherit;
    text-decoration: none;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const BookingDates = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--text-color);
  
  i {
    margin: 0 0.5rem;
    color: var(--text-muted);
  }
`;

const BookingStatus = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch(props.status) {
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
    switch(props.status) {
      case 'confirmed':
        return 'var(--success-color)';
      case 'pending':
        return 'var(--warning-color)';
      case 'cancelled':
        return 'var(--danger-color)';
      default:
        return 'var(--info-color)';
    }
  }};
`;

const BookingPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 1rem;
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const BookingDetail = styled.div`
  span:first-child {
    display: block;
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 0.2rem;
  }
  
  span:last-child {
    font-weight: 600;
    color: var(--dark-color);
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
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }
`;

const ActionButton = styled(Button)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
`;

const CancelButton = styled(ActionButton)`
  background-color: var(--danger-color);
  
  &::before {
    background-color: #b71c1c;
  }
`;

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required('Имя обязательно'),
  lastName: Yup.string().required('Фамилия обязательна'),
  email: Yup.string().email('Некорректный формат email').required('Email обязателен'),
  phone: Yup.string().matches(/^\+?[0-9\s-()]+$/, 'Некорректный формат телефона')
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Введите текущий пароль'),
  newPassword: Yup.string()
    .required('Введите новый пароль')
    .min(8, 'Пароль должен быть не менее 8 символов')
    .matches(/[a-zA-Z]/, 'Пароль должен содержать минимум одну букву')
    .matches(/[0-9]/, 'Пароль должен содержать минимум одну цифру'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Пароли должны совпадать')
    .required('Подтвердите новый пароль')
});

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState(null);
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Загрузка бронирований пользователя
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await bookingService.getUserBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
      } finally {
        setBookingsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, navigate]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setProfileUpdateStatus(null);
      
      const response = await userService.updateProfile(values);
      updateUser(response.data);
      
      setProfileUpdateStatus({
        type: 'success',
        message: 'Профиль успешно обновлен'
      });
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setProfileUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Не удалось обновить профиль'
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  const handleUpdatePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      setPasswordUpdateStatus(null);
      
      await userService.updatePassword(values);
      
      setPasswordUpdateStatus({
        type: 'success',
        message: 'Пароль успешно обновлен'
      });
      
      resetForm();
    } catch (error) {
      console.error('Ошибка при обновлении пароля:', error);
      setPasswordUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Не удалось обновить пароль'
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        
        // Обновление состояния бронирований
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
          )
        );
      } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        alert('Не удалось отменить бронирование');
      }
    }
  };
  
  const handleLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      logout();
      navigate('/');
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <PageContainer>
      <ProfileHeader>
        <PageTitle>Личный кабинет</PageTitle>
        <Subtitle>Добро пожаловать, {user.firstName}!</Subtitle>
      </ProfileHeader>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => handleTabChange('profile')}
        >
          Профиль
        </Tab>
        <Tab 
          active={activeTab === 'password'} 
          onClick={() => handleTabChange('password')}
        >
          Изменить пароль
        </Tab>
        <Tab 
          active={activeTab === 'bookings'} 
          onClick={() => handleTabChange('bookings')}
        >
          Мои бронирования
        </Tab>
      </TabContainer>
      
      {activeTab === 'profile' && (
        <ContentWrapper>
          <FormSection>
            <SectionTitle>Личные данные</SectionTitle>
            
            {profileUpdateStatus && (
              <Alert type={profileUpdateStatus.type}>
                {profileUpdateStatus.message}
              </Alert>
            )}
            
            <Formik
              initialValues={{
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
              }}
              validationSchema={profileSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputGroup>
                    <label htmlFor="firstName">Имя</label>
                    <Input type="text" id="firstName" name="firstName" placeholder="Введите имя" />
                    <ErrorMessage name="firstName" component={Error} />
                  </InputGroup>
                  
                  <InputGroup>
                    <label htmlFor="lastName">Фамилия</label>
                    <Input type="text" id="lastName" name="lastName" placeholder="Введите фамилию" />
                    <ErrorMessage name="lastName" component={Error} />
                  </InputGroup>
                  
                  <InputGroup>
                    <label htmlFor="email">Email</label>
                    <Input type="email" id="email" name="email" placeholder="Введите email" />
                    <ErrorMessage name="email" component={Error} />
                  </InputGroup>
                  
                  <InputGroup>
                    <label htmlFor="phone">Телефон</label>
                    <Input type="text" id="phone" name="phone" placeholder="Введите телефон" />
                    <ErrorMessage name="phone" component={Error} />
                  </InputGroup>
                  
                  <Button type="submit" disabled={isSubmitting || loading}>
                    {isSubmitting || loading ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </Form>
              )}
            </Formik>
            
            <LogoutButton type="button" onClick={handleLogout}>
              Выйти из аккаунта
            </LogoutButton>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Информация об аккаунте</SectionTitle>
            
            <BookingDetails>
              <BookingDetail>
                <span>Дата регистрации</span>
                <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              </BookingDetail>
              <BookingDetail>
                <span>Количество бронирований</span>
                <span>{bookings.length}</span>
              </BookingDetail>
              <BookingDetail>
                <span>Статус</span>
                <span>Активный</span>
              </BookingDetail>
              <BookingDetail>
                <span>Последнее посещение</span>
                <span>{new Date().toLocaleDateString()}</span>
              </BookingDetail>
            </BookingDetails>
            
            <SectionTitle>Предпочтения</SectionTitle>
            <p style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
              Скоро здесь появится возможность настройки ваших предпочтений для более удобной работы с сайтом.
            </p>
          </FormSection>
        </ContentWrapper>
      )}
      
      {activeTab === 'password' && (
        <ContentWrapper>
          <FormSection>
            <SectionTitle>Изменение пароля</SectionTitle>
            
            {passwordUpdateStatus && (
              <Alert type={passwordUpdateStatus.type}>
                {passwordUpdateStatus.message}
              </Alert>
            )}
            
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              }}
              validationSchema={passwordSchema}
              onSubmit={handleUpdatePassword}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputGroup>
                    <label htmlFor="currentPassword">Текущий пароль</label>
                    <Input 
                      type="password" 
                      id="currentPassword" 
                      name="currentPassword" 
                      placeholder="Введите текущий пароль" 
                    />
                    <ErrorMessage name="currentPassword" component={Error} />
                  </InputGroup>
                  
                  <InputGroup>
                    <label htmlFor="newPassword">Новый пароль</label>
                    <Input 
                      type="password" 
                      id="newPassword" 
                      name="newPassword" 
                      placeholder="Введите новый пароль" 
                    />
                    <ErrorMessage name="newPassword" component={Error} />
                  </InputGroup>
                  
                  <InputGroup>
                    <label htmlFor="confirmPassword">Подтверждение пароля</label>
                    <Input 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      placeholder="Подтвердите новый пароль" 
                    />
                    <ErrorMessage name="confirmPassword" component={Error} />
                  </InputGroup>
                  
                  <Button type="submit" disabled={isSubmitting || loading}>
                    {isSubmitting || loading ? 'Обновление...' : 'Обновить пароль'}
                  </Button>
                </Form>
              )}
            </Formik>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Защита аккаунта</SectionTitle>
            <p style={{ color: 'var(--text-color)', lineHeight: '1.7' }}>
              Для обеспечения безопасности аккаунта рекомендуем:
            </p>
            
            <ul style={{ 
              color: 'var(--text-color)', 
              lineHeight: '1.7', 
              paddingLeft: '1.2rem',
              marginTop: '1rem'
            }}>
              <li>Использовать сложный пароль, содержащий буквы, цифры и специальные символы</li>
              <li>Регулярно менять пароль (не реже одного раза в 3 месяца)</li>
              <li>Не использовать один и тот же пароль для разных сервисов</li>
              <li>Не передавать учетные данные третьим лицам</li>
              <li>Всегда выходить из аккаунта при использовании общедоступных компьютеров</li>
            </ul>
          </FormSection>
        </ContentWrapper>
      )}
      
      {activeTab === 'bookings' && (
        <div>
          <SectionTitle>Ваши бронирования</SectionTitle>
          
          {bookingsLoading ? (
            <div>Загрузка бронирований...</div>
          ) : bookings && bookings.length > 0 ? (
            <BookingList>
              {bookings.map(booking => (
                <BookingCard key={booking.id}>
                  <BookingHeader>
                    <BookingTitle>
                      {booking.room?.name || 'Номер'}
                    </BookingTitle>
                    <BookingStatus status={booking.status}>
                      {booking.status === 'confirmed' && 'Подтверждено'}
                      {booking.status === 'pending' && 'В обработке'}
                      {booking.status === 'cancelled' && 'Отменено'}
                    </BookingStatus>
                  </BookingHeader>
                  
                  <BookingDates>
                    <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                    <i className="fas fa-arrow-right"></i>
                    <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                  </BookingDates>
                  
                  <BookingDetails>
                    <BookingDetail>
                      <span>Номер бронирования</span>
                      <span>#{booking.id}</span>
                    </BookingDetail>
                    <BookingDetail>
                      <span>Дата создания</span>
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </BookingDetail>
                    <BookingDetail>
                      <span>Количество гостей</span>
                      <span>{booking.guestsCount || 1}</span>
                    </BookingDetail>
                    <BookingDetail>
                      <span>Категория номера</span>
                      <span>{booking.room?.roomType || 'Стандарт'}</span>
                    </BookingDetail>
                  </BookingDetails>
                  
                  <BookingPrice>
                    {booking.totalPrice?.toLocaleString() || (booking.room?.price * 
                      ((new Date(booking.checkOut) - new Date(booking.checkIn)) / 
                      (1000 * 60 * 60 * 24))
                    ).toLocaleString()} ₽
                  </BookingPrice>
                  
                  {booking.status !== 'cancelled' && (
                    <CancelButton 
                      type="button" 
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Отменить бронирование
                    </CancelButton>
                  )}
                </BookingCard>
              ))}
            </BookingList>
          ) : (
            <EmptyState>
              <i className="fas fa-calendar-times"></i>
              <h3>У вас пока нет бронирований</h3>
              <p>Забронируйте номер в нашем отеле для комфортного отдыха</p>
              <ActionButton 
                as="a" 
                href="/rooms" 
                style={{ textDecoration: 'none' }}
              >
                Посмотреть номера
              </ActionButton>
            </EmptyState>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default ProfilePage; 