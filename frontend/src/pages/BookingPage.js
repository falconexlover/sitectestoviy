import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { roomService, bookingService } from '../services/api';

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

const BookingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const BookingForm = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--dark-color);
  margin-bottom: 1.5rem;
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--dark-color);
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

const Select = styled(Field)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.1);
  }
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
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
  }

  .react-datepicker {
    font-family: 'Montserrat', sans-serif;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
  }

  .react-datepicker__header {
    background-color: var(--primary-color);
    border-bottom: none;
    color: white;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker__day-name {
    color: white;
  }

  .react-datepicker__day--selected {
    background-color: var(--accent-color);
  }
`;

const Error = styled.div`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  flex: 1;

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: var(--dark-color);
  border: 1px solid var(--border-color);

  &:hover {
    background-color: var(--light-color);
    color: var(--dark-color);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const RoomPreview = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

const RoomList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const RoomCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
  }

  ${props =>
    props.selected &&
    `
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color);
  `}
`;

const RoomImage = styled.div`
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RoomInfo = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RoomName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const RoomType = styled.p`
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
`;

const RoomFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RoomFeature = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-color);

  i {
    color: var(--primary-color);
    margin-right: 0.3rem;
  }
`;

const RoomPrice = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:first-child {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
  }

  span:last-child {
    font-size: 0.9rem;
    color: var(--text-muted);
  }
`;

const AvailabilityBadge = styled.div`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  margin-top: 0.5rem;
  background-color: ${props =>
    props.available ? 'rgba(33, 113, 72, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
  color: ${props => (props.available ? 'var(--success-color)' : 'var(--danger-color)')};
`;

const CheckoutSummary = styled.div`
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;

  &.total {
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--border-color);
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

const LoginPrompt = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  a {
    color: var(--primary-color);
    text-decoration: underline;
    font-weight: 600;
    transition: var(--transition);

    &:hover {
      color: var(--accent-color);
    }
  }
`;

const phoneRegex = /^\+?[0-9()-]{10,15}$/;

const BookingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [status, setStatus] = useState(null);

  // Начальные значения для формы бронирования
  const initialValues = {
    roomId: '',
    checkIn: new Date(Date.now() + 86400000), // Завтрашняя дата
    checkOut: new Date(Date.now() + 86400000 * 4), // Дата + 4 дня
    adults: 1,
    children: 0,
    specialRequests: '',
    firstName: user ? user.firstName || '' : '',
    lastName: user ? user.lastName || '' : '',
    email: user ? user.email || '' : '',
    phone: user ? user.phone || '' : '',
  };

  // Схема валидации для формы бронирования
  const validationSchema = Yup.object({
    checkIn: Yup.date().required('Пожалуйста, выберите дату заезда'),
    checkOut: Yup.date()
      .required('Пожалуйста, выберите дату выезда')
      .min(Yup.ref('checkIn'), 'Дата выезда должна быть позже даты заезда'),
    adults: Yup.number()
      .required('Укажите количество взрослых')
      .min(1, 'Минимум 1 взрослый')
      .max(10, 'Максимум 10 взрослых'),
    children: Yup.number()
      .required('Укажите количество детей')
      .min(0, 'Минимум 0 детей')
      .max(10, 'Максимум 10 детей'),
    firstName: Yup.string().required('Пожалуйста, введите имя'),
    lastName: Yup.string().required('Пожалуйста, введите фамилию'),
    email: Yup.string().email('Неверный формат email').required('Пожалуйста, введите email'),
    phone: Yup.string()
      .matches(phoneRegex, 'Неверный формат телефона')
      .required('Пожалуйста, введите номер телефона'),
  });

  // Загрузка всех номеров при монтировании компонента
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await roomService.getRooms();
        setRooms(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке номеров:', error);
        setStatus({
          type: 'error',
          message: 'Не удалось загрузить доступные номера. Пожалуйста, попробуйте позже.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Функция для обработки отправки формы
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!selectedRoom) {
      setStatus({
        type: 'error',
        message: 'Пожалуйста, выберите номер для бронирования',
      });
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        roomId: selectedRoom._id,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        adults: values.adults,
        children: values.children,
        specialRequests: values.specialRequests,
        guestInfo: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        },
      };

      const response = await bookingService.createBooking(bookingData);

      setStatus({
        type: 'success',
        message: 'Бронирование успешно создано! Номер бронирования: ' + response.data.bookingNumber,
      });

      resetForm();
      setSelectedRoom(null);

      // Перенаправление на страницу с бронированиями через 3 секунды
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Функция для расчета количества дней
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Функция для расчета общей стоимости
  const calculateTotalPrice = (room, checkIn, checkOut) => {
    if (!room || !checkIn || !checkOut) return 0;
    const days = calculateDays(checkIn, checkOut);
    return room.price * days;
  };

  // Поиск доступных номеров по датам
  const searchAvailableRooms = async (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return;

    try {
      setLoading(true);
      const response = await roomService.getAvailableRooms({
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });

      setAvailableRooms(response.data);

      // Если выбранный номер больше не доступен, снимаем выбор
      if (selectedRoom && !response.data.find(room => room._id === selectedRoom._id)) {
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Ошибка при поиске доступных номеров:', error);
      setStatus({
        type: 'error',
        message: 'Не удалось проверить доступность номеров. Пожалуйста, попробуйте позже.',
      });
    } finally {
      setLoading(false);
    }
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

  // Проверка, доступен ли номер
  const isRoomAvailable = roomId => {
    return availableRooms.some(room => room._id === roomId);
  };

  // Если пользователь не авторизован, показываем сообщение с предложением войти
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Бронирование номера</PageTitle>
          <PageSubtitle>Выберите номер и даты проживания для создания бронирования</PageSubtitle>
        </PageHeader>

        <LoginPrompt>
          <i
            className="fas fa-user-lock"
            style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}
          ></i>
          <h3>Требуется авторизация</h3>
          <p>Для бронирования номера необходимо войти в аккаунт или зарегистрироваться</p>
          <ButtonContainer>
            <Button onClick={() => navigate('/login')}>Войти</Button>
            <CancelButton onClick={() => navigate('/register')}>Зарегистрироваться</CancelButton>
          </ButtonContainer>
        </LoginPrompt>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Бронирование номера</PageTitle>
        <PageSubtitle>Выберите номер и даты проживания для создания бронирования</PageSubtitle>
      </PageHeader>

      {status && (
        <Alert type={status.type}>
          <i
            className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}
          ></i>
          {status.message}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <BookingContainer>
              <BookingForm>
                <SectionTitle>Информация о бронировании</SectionTitle>

                <FormGroup>
                  <Label>Даты проживания</Label>
                  <FormRow>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={values.checkIn}
                        onChange={date => {
                          setFieldValue('checkIn', date);
                          searchAvailableRooms(date, values.checkOut);
                        }}
                        selectsStart
                        startDate={values.checkIn}
                        endDate={values.checkOut}
                        minDate={new Date()}
                        placeholderText="Дата заезда"
                        dateFormat="dd.MM.yyyy"
                      />
                      <ErrorMessage name="checkIn" component={Error} />
                    </DatePickerWrapper>

                    <DatePickerWrapper>
                      <DatePicker
                        selected={values.checkOut}
                        onChange={date => {
                          setFieldValue('checkOut', date);
                          searchAvailableRooms(values.checkIn, date);
                        }}
                        selectsEnd
                        startDate={values.checkIn}
                        endDate={values.checkOut}
                        minDate={values.checkIn}
                        placeholderText="Дата выезда"
                        dateFormat="dd.MM.yyyy"
                      />
                      <ErrorMessage name="checkOut" component={Error} />
                    </DatePickerWrapper>
                  </FormRow>
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="adults">Взрослые</Label>
                    <Select as="select" name="adults" id="adults">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </Select>
                    <ErrorMessage name="adults" component={Error} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="children">Дети</Label>
                    <Select as="select" name="children" id="children">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Select>
                    <ErrorMessage name="children" component={Error} />
                  </FormGroup>
                </FormRow>

                <SectionTitle>Информация о госте</SectionTitle>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="firstName">Имя</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Введите ваше имя"
                    />
                    <ErrorMessage name="firstName" component={Error} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Введите вашу фамилию"
                    />
                    <ErrorMessage name="lastName" component={Error} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" placeholder="Введите ваш email" />
                    <ErrorMessage name="email" component={Error} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Введите ваш номер телефона"
                    />
                    <ErrorMessage name="phone" component={Error} />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="specialRequests">Особые пожелания</Label>
                  <Input
                    as="textarea"
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Укажите особые пожелания к проживанию"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                  />
                </FormGroup>

                {selectedRoom && (
                  <CheckoutSummary>
                    <SectionTitle>Итоговая информация</SectionTitle>
                    <SummaryRow>
                      <span>Номер:</span>
                      <span>{selectedRoom.name}</span>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Даты:</span>
                      <span>
                        {values.checkIn && values.checkIn.toLocaleDateString('ru-RU')} -{' '}
                        {values.checkOut && values.checkOut.toLocaleDateString('ru-RU')} (
                        {calculateDays(values.checkIn, values.checkOut)} дн.)
                      </span>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Гости:</span>
                      <span>
                        {values.adults} взр.{' '}
                        {values.children > 0 ? `+ ${values.children} дет.` : ''}
                      </span>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Стоимость за ночь:</span>
                      <span>{selectedRoom.price.toLocaleString()} ₽</span>
                    </SummaryRow>
                    <SummaryRow className="total">
                      <span>Итого:</span>
                      <span>
                        {calculateTotalPrice(
                          selectedRoom,
                          values.checkIn,
                          values.checkOut
                        ).toLocaleString()}{' '}
                        ₽
                      </span>
                    </SummaryRow>
                  </CheckoutSummary>
                )}

                <ButtonContainer>
                  <Button type="submit" disabled={isSubmitting || !selectedRoom}>
                    {isSubmitting ? 'Отправка...' : 'Забронировать'}
                  </Button>
                  <CancelButton type="button" onClick={() => navigate('/rooms')}>
                    Отмена
                  </CancelButton>
                </ButtonContainer>
              </BookingForm>

              <RoomPreview>
                <SectionTitle>Выберите номер</SectionTitle>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ fontSize: '2rem', color: 'var(--primary-color)' }}
                    ></i>
                    <p style={{ marginTop: '1rem' }}>Загрузка номеров...</p>
                  </div>
                ) : (
                  <>
                    {values.checkIn && values.checkOut ? (
                      <>
                        <p style={{ marginBottom: '1rem' }}>
                          {availableRooms.length > 0
                            ? `Доступно ${availableRooms.length} номеров на выбранные даты`
                            : 'Нет доступных номеров на выбранные даты. Пожалуйста, выберите другие даты.'}
                        </p>

                        <RoomList>
                          {rooms.map(room => (
                            <RoomCard
                              key={room._id}
                              selected={selectedRoom && selectedRoom._id === room._id}
                              onClick={() => isRoomAvailable(room._id) && setSelectedRoom(room)}
                              style={{ opacity: isRoomAvailable(room._id) ? 1 : 0.6 }}
                            >
                              <RoomImage>
                                <img
                                  src={
                                    room.images && room.images.length > 0
                                      ? room.images[0]
                                      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
                                  }
                                  alt={room.name}
                                />
                              </RoomImage>
                              <RoomInfo>
                                <RoomName>{room.name}</RoomName>
                                <RoomType>{getRoomTypeName(room.roomType)}</RoomType>

                                <RoomFeatures>
                                  <RoomFeature>
                                    <i className="fas fa-user"></i> {room.capacity} чел.
                                  </RoomFeature>
                                  <RoomFeature>
                                    <i className="fas fa-expand"></i> {room.area || '25'} м²
                                  </RoomFeature>
                                  <RoomFeature>
                                    <i className="fas fa-bed"></i> {room.beds || '1 двуспальная'}
                                  </RoomFeature>
                                </RoomFeatures>

                                <AvailabilityBadge available={isRoomAvailable(room._id)}>
                                  {isRoomAvailable(room._id)
                                    ? 'Доступен'
                                    : 'Не доступен на выбранные даты'}
                                </AvailabilityBadge>

                                <RoomPrice>
                                  <span>{room.price.toLocaleString()} ₽</span>
                                  <span>за ночь</span>
                                </RoomPrice>
                              </RoomInfo>
                            </RoomCard>
                          ))}
                        </RoomList>
                      </>
                    ) : (
                      <p>
                        Пожалуйста, выберите даты заезда и выезда, чтобы увидеть доступные номера
                      </p>
                    )}
                  </>
                )}
              </RoomPreview>
            </BookingContainer>
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default BookingPage;
