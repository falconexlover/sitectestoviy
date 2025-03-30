import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { roomService, bookingService } from '../services/api';
import { ru } from 'date-fns/locale';
import { addDays, format, differenceInDays } from 'date-fns';
// Импортируем компоненты формы бронирования
import {
  BookingTypeSelector,
  BookingTypeButton,
  FormSection,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
  StyledDatePicker,
  PriceSummary,
  SummaryTitle,
  SummaryPrice,
  SummaryDetails,
  SummaryItem,
  BookingFormButton,
  BookingPolicy,
  PolicyLink,
  BookingInfo,
  InfoTitle,
  InfoText
} from '../components/booking/BookingFormElements';

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

const BookingForm = styled.form`
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
  grid-template-columns: 1fr 1fr;
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
  background-color: white;
  padding: 3rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  max-width: 600px;
  margin: 0 auto;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--dark-color);
  }
  
  p {
    color: var(--text-muted);
    margin-bottom: 2rem;
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
  const [bookingType, setBookingType] = useState('room');
  const [roomInfo, setRoomInfo] = useState(null);
  
  const roomTypes = [
    {
      id: 1,
      name: '2-местный эконом',
      description: 'Уютный номер с двумя отдельными кроватями, балконом и видом на парк. 11 кв.м. Общая ванная комната.',
      price: 2500,
      priceDouble: 3000,
      maxGuests: 2,
      image: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: ['Телевизор', 'Общий душ', 'Балкон', 'Вид на парк'],
    },
    {
      id: 2,
      name: '2-местный семейный',
      description: 'Комфортный номер-стандарт с двуспальной кроватью, 22 кв.м. Душевая кабина, санузел и вид на парк из окна.',
      price: 3800,
      priceDouble: 3800,
      maxGuests: 2,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      features: ['Двуспальная кровать', 'Холодильник', 'Душевая кабина', 'Санузел'],
    },
    {
      id: 3,
      name: '4-местный эконом',
      description: 'Просторный номер с балконом, 25 кв.м. Четыре односпальных кровати в 2 комнатах. Душевая кабина, ванна, санузел.',
      price: 5000,
      priceDouble: 5000,
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      features: ['Вид на парк', '2 комнаты', 'Ванна и душ', 'Балкон'],
    },
  ];
  
  const services = [
    {
      id: 1,
      type: 'sauna',
      name: 'Сауна',
      description: 'Сауна с купелью и двумя парилками - сухой и русской. Просторная комната отдыха для релакса.',
      price: 1275,
      image: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      features: ['Купель 18-20°C', 'Возможен заказ еды', 'Два вида парных'],
    },
    {
      id: 2,
      type: 'conference',
      name: 'Конференц-зал',
      description: 'Просторный конференц-зал 62 кв.м на 2 этаже. Светлое помещение с оборудованием для презентаций.',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80',
      features: ['Вместимость до 40 человек', 'Проектор, экран, флип-чарт', 'Конференц-оборудование'],
    },
  ];

  const formik = useFormik({
    initialValues: {
      bookingType: 'room',
      roomType: '',
      serviceType: '',
      checkIn: new Date(),
      checkOut: addDays(new Date(), 1),
      guests: 1,
      serviceHours: 1,
      serviceDate: new Date(),
      serviceTime: '12:00',
      name: '',
      phone: '',
      email: '',
      additionalRequests: '',
    },
    validationSchema: Yup.object({
      roomType: Yup.string().when('bookingType', {
        is: 'room',
        then: () => Yup.string().required('Выберите тип номера'),
      }),
      serviceType: Yup.string().when('bookingType', {
        is: 'service',
        then: () => Yup.string().required('Выберите услугу'),
      }),
      guests: Yup.number().min(1, 'Минимум 1 гость').required('Укажите количество гостей'),
      name: Yup.string().required('Введите ваше имя'),
      phone: Yup.string().required('Введите ваш телефон'),
      email: Yup.string().email('Неверный формат email').required('Введите ваш email'),
    }),
    onSubmit: values => {
      setLoading(true);
      
      // Создаем объект данных для отправки
      const bookingData = {
        roomId: values.roomType,
        checkIn: values.checkIn.toISOString(),
        checkOut: values.checkOut.toISOString(),
        adults: values.guests,
        specialRequests: values.additionalRequests,
      };
      
      // Отправляем запрос на создание бронирования
      bookingService.createBooking(bookingData)
        .then(response => {
          setLoading(false);
          setStatus({
            type: 'success',
            message: 'Бронирование успешно создано!'
          });
          formik.resetForm();
          setTimeout(() => {
            navigate(`/bookings/${response.data.id}`);
          }, 1500);
        })
        .catch(error => {
          setLoading(false);
          console.error('Ошибка при создании бронирования:', error);
          setStatus({
            type: 'error',
            message: error.response?.data?.message || 'Не удалось создать бронирование. Пожалуйста, попробуйте позже.'
          });
        });
    },
  });

  // Эффект для обновления maxGuests при выборе типа номера
  useEffect(() => {
    if (bookingType === 'room' && formik.values.roomType) {
      const selectedRoom = roomTypes.find(room => room.id === parseInt(formik.values.roomType));
      if (selectedRoom) {
        setRoomInfo(selectedRoom);
        formik.setFieldValue('guests', 1);
      }
    } else {
      setRoomInfo(null);
    }
  }, [formik.values.roomType, bookingType]);

  // Обработчик смены типа бронирования
  const handleBookingTypeChange = type => {
    setBookingType(type);
    formik.setFieldValue('bookingType', type);
  };

  // Вычисляем общую стоимость
  const calculateTotalPrice = () => {
    if (bookingType === 'room' && roomInfo) {
      const nights = differenceInDays(formik.values.checkOut, formik.values.checkIn);
      let basePrice = roomInfo.price;
      
      // Если 2 гостя и есть отдельная цена для двоих, используем ее
      if (formik.values.guests === 2 && roomInfo.priceDouble) {
        basePrice = roomInfo.priceDouble;
      }
      
      return basePrice * nights;
    } else if (bookingType === 'service' && formik.values.serviceType) {
      const selectedService = services.find(service => service.id === parseInt(formik.values.serviceType));
      if (selectedService) {
        return selectedService.price * formik.values.serviceHours;
      }
    }
    return 0;
  };

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
        <PageTitle>Бронирование</PageTitle>
        <PageSubtitle>
          Забронируйте номер или дополнительные услуги гостиничного комплекса «Лесной дворик»
        </PageSubtitle>
      </PageHeader>

      <BookingTypeSelector>
        <BookingTypeButton 
          active={bookingType === 'room'} 
          onClick={() => handleBookingTypeChange('room')}
        >
          Забронировать номер
        </BookingTypeButton>
        <BookingTypeButton 
          active={bookingType === 'service'} 
          onClick={() => handleBookingTypeChange('service')}
        >
          Забронировать услугу
        </BookingTypeButton>
      </BookingTypeSelector>

      <BookingForm onSubmit={formik.handleSubmit}>
        <FormSection>
          <SectionTitle>Детали бронирования</SectionTitle>
          
          {bookingType === 'room' && (
            <>
                <FormGroup>
                <FormLabel>Выберите тип номера</FormLabel>
                <FormSelect
                  name="roomType"
                  value={formik.values.roomType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Выберите тип номера</option>
                  {roomTypes.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.price} ₽/сутки
                    </option>
                  ))}
                </FormSelect>
                {formik.touched.roomType && formik.errors.roomType && (
                  <FormError>{formik.errors.roomType}</FormError>
                )}
              </FormGroup>

                  <FormRow>
                <FormGroup>
                  <FormLabel>Дата заезда</FormLabel>
                  <StyledDatePicker
                    selected={formik.values.checkIn}
                        onChange={date => {
                      formik.setFieldValue('checkIn', date);
                      if (differenceInDays(formik.values.checkOut, date) < 1) {
                        formik.setFieldValue('checkOut', addDays(date, 1));
                      }
                    }}
                        dateFormat="dd.MM.yyyy"
                    locale={ru}
                    minDate={new Date()}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Дата отъезда</FormLabel>
                  <StyledDatePicker
                    selected={formik.values.checkOut}
                    onChange={date => formik.setFieldValue('checkOut', date)}
                        dateFormat="dd.MM.yyyy"
                    locale={ru}
                    minDate={addDays(formik.values.checkIn, 1)}
                      />
                </FormGroup>
                  </FormRow>

              <FormGroup>
                <FormLabel>Количество гостей</FormLabel>
                <FormSelect
                  name="guests"
                  value={formik.values.guests}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!roomInfo}
                >
                  {roomInfo && Array.from({ length: roomInfo.maxGuests }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'гость' : i < 4 ? 'гостя' : 'гостей'}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
            </>
          )}

          {bookingType === 'service' && (
            <>
              <FormGroup>
                <FormLabel>Выберите услугу</FormLabel>
                <FormSelect
                  name="serviceType"
                  value={formik.values.serviceType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Выберите услугу</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price} ₽/час
                    </option>
                  ))}
                </FormSelect>
                {formik.touched.serviceType && formik.errors.serviceType && (
                  <FormError>{formik.errors.serviceType}</FormError>
                )}
                </FormGroup>

                <FormRow>
                  <FormGroup>
                  <FormLabel>Дата</FormLabel>
                  <StyledDatePicker
                    selected={formik.values.serviceDate}
                    onChange={date => formik.setFieldValue('serviceDate', date)}
                    dateFormat="dd.MM.yyyy"
                    locale={ru}
                    minDate={new Date()}
                  />
                  </FormGroup>

                  <FormGroup>
                  <FormLabel>Время</FormLabel>
                  <FormSelect
                    name="serviceTime"
                    value={formik.values.serviceTime}
                    onChange={formik.handleChange}
                  >
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 10; // Начинаем с 10:00
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </FormSelect>
                  </FormGroup>
                </FormRow>

              <FormGroup>
                <FormLabel>Продолжительность (часов)</FormLabel>
                <FormSelect
                  name="serviceHours"
                  value={formik.values.serviceHours}
                  onChange={formik.handleChange}
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'час' : i < 4 ? 'часа' : 'часов'}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

                  <FormGroup>
                <FormLabel>Количество гостей</FormLabel>
                <FormSelect
                  name="guests"
                  value={formik.values.guests}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'гость' : i < 4 ? 'гостя' : 'гостей'}
                    </option>
                  ))}
                </FormSelect>
                  </FormGroup>
            </>
          )}
        </FormSection>

        <FormSection>
          <SectionTitle>Контактная информация</SectionTitle>

                  <FormGroup>
            <FormLabel>Имя и фамилия</FormLabel>
            <FormInput
                      type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Иван Иванов"
            />
            {formik.touched.name && formik.errors.name && (
              <FormError>{formik.errors.name}</FormError>
            )}
                  </FormGroup>

                <FormRow>
                  <FormGroup>
              <FormLabel>Телефон</FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
              {formik.touched.phone && formik.errors.phone && (
                <FormError>{formik.errors.phone}</FormError>
              )}
                  </FormGroup>

                  <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="example@mail.ru"
              />
              {formik.touched.email && formik.errors.email && (
                <FormError>{formik.errors.email}</FormError>
              )}
                  </FormGroup>
                </FormRow>

                <FormGroup>
            <FormLabel>Дополнительные пожелания</FormLabel>
            <FormTextarea
              name="additionalRequests"
              value={formik.values.additionalRequests}
              onChange={formik.handleChange}
              placeholder="Укажите любые дополнительные пожелания или комментарии..."
                  />
                </FormGroup>
        </FormSection>

        <PriceSummary>
          <SummaryTitle>Итого к оплате:</SummaryTitle>
          <SummaryPrice>{calculateTotalPrice()} ₽</SummaryPrice>
          <SummaryDetails>
            {bookingType === 'room' && roomInfo && (
              <>
                <SummaryItem>
                  <span>Тип номера:</span>
                  <span>{roomInfo.name}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Период:</span>
                      <span>
                    {format(formik.values.checkIn, 'dd.MM.yyyy')} - {format(formik.values.checkOut, 'dd.MM.yyyy')}
                      </span>
                </SummaryItem>
                <SummaryItem>
                  <span>Количество ночей:</span>
                  <span>{differenceInDays(formik.values.checkOut, formik.values.checkIn)}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Гостей:</span>
                  <span>{formik.values.guests}</span>
                </SummaryItem>
                <SummaryItem>
                      <span>Стоимость за ночь:</span>
                      <span>
                    {formik.values.guests === 2 && roomInfo.priceDouble ? roomInfo.priceDouble : roomInfo.price} ₽
                      </span>
                </SummaryItem>
              </>
            )}
            {bookingType === 'service' && formik.values.serviceType && (
              <>
                {services.filter(service => service.id === parseInt(formik.values.serviceType)).map(service => (
                  <React.Fragment key={service.id}>
                    <SummaryItem>
                      <span>Услуга:</span>
                      <span>{service.name}</span>
                    </SummaryItem>
                    <SummaryItem>
                      <span>Дата:</span>
                      <span>{format(formik.values.serviceDate, 'dd.MM.yyyy')}</span>
                    </SummaryItem>
                    <SummaryItem>
                      <span>Время:</span>
                      <span>{formik.values.serviceTime}</span>
                    </SummaryItem>
                    <SummaryItem>
                      <span>Продолжительность:</span>
                      <span>{formik.values.serviceHours} ч.</span>
                    </SummaryItem>
                    <SummaryItem>
                      <span>Гостей:</span>
                      <span>{formik.values.guests}</span>
                    </SummaryItem>
                    <SummaryItem>
                      <span>Стоимость в час:</span>
                      <span>{service.price} ₽</span>
                    </SummaryItem>
                  </React.Fragment>
                ))}
              </>
            )}
          </SummaryDetails>
        </PriceSummary>

        <BookingFormButton type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Забронировать'}
        </BookingFormButton>
        
        <BookingPolicy>
          Нажимая кнопку "Забронировать", вы соглашаетесь с нашими <PolicyLink href="/terms">правилами бронирования</PolicyLink> и <PolicyLink href="/privacy">политикой конфиденциальности</PolicyLink>.
        </BookingPolicy>
      </BookingForm>

      <BookingInfo>
        <InfoTitle>Информация о бронировании</InfoTitle>
        <InfoText>
          <p>
            <strong>Заезд:</strong> с 14:00<br />
            <strong>Выезд:</strong> до 12:00
          </p>
          <p>
            При бронировании номера предоплата не требуется. Вы можете оплатить проживание при заселении.
          </p>
          <p>
            Для подтверждения бронирования с вами свяжется администратор гостиницы.
          </p>
          <p>
            Если у вас возникли вопросы, вы можете связаться с нами по телефону:
          </p>
          <p>
            <strong>Гостиница:</strong> 8 (498) 483 19 41<br />
            <strong>Гостиница (моб.):</strong> 8 (915) 120 17 44<br />
            <strong>Сауна:</strong> 8 (915) 120 17 44<br />
            <strong>Конференц-зал:</strong> 8 (916) 926 65 14
          </p>
        </InfoText>
      </BookingInfo>
    </PageContainer>
  );
};

export default BookingPage;
