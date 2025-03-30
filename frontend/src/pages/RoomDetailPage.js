import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService, bookingService } from '../services/api';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);

  i {
    margin-right: 0.5rem;
  }

  &:hover {
    color: var(--accent-color);
    transform: translateX(-5px);
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const RoomGallery = styled.div`
  margin-bottom: 2rem;
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    pointer-events: none;
  }
`;

const ThumbnailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Thumbnail = styled.div`
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  opacity: ${props => (props.active ? 1 : 0.6)};
  box-shadow: ${props => (props.active ? 'var(--shadow-md)' : 'var(--shadow-sm)')};
  transition: var(--transition);
  border: ${props => (props.active ? '2px solid var(--primary-color)' : 'none')};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-3px);
  }
`;

const RoomDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoomTitle = styled.h1`
  color: var(--dark-color);
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const RoomType = styled.span`
  display: inline-block;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
`;

const RoomNumber = styled.span`
  display: inline-block;
  background-color: var(--light-color);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
`;

const RoomDescription = styled.div`
  margin-bottom: 2rem;
  color: var(--text-color);
  line-height: 1.7;

  p {
    margin-bottom: 1rem;
  }
`;

const RoomPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 1rem 0;
  font-family: 'Playfair Display', serif;

  span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-muted);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--light-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);

  i {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: 50%;
    margin-right: 1rem;
    font-size: 1.2rem;
  }

  div {
    span:first-child {
      display: block;
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }

    span:last-child {
      font-weight: 600;
      color: var(--dark-color);
    }
  }
`;

const SectionTitle = styled.h2`
  color: var(--dark-color);
  margin: 2rem 0 1rem 0;
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const AmenitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--light-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);

  i {
    color: var(--accent-color);
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }

  span {
    font-size: 0.95rem;
  }
`;

const BookingBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  height: fit-content;
  position: sticky;
  top: 100px;

  h3 {
    font-family: 'Playfair Display', serif;
    color: var(--dark-color);
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  @media (max-width: 992px) {
    position: static;
    margin-top: 2rem;
  }
`;

const BookingDate = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--dark-color);
  }
`;

const StyledDatePicker = styled(DatePicker)`
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

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 0;
  margin: 1.5rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
`;

const BookButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
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

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);

  p {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const LoginButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  margin-right: 1rem;
  transition: var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
    background-color: var(--dark-color);
  }
`;

const RegisterButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: var(--light-color);
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
  }
`;

const StatusMessage = styled.div`
  background-color: ${props =>
    props.type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    margin-right: 0.5rem;
  }
`;

const bookingSchema = Yup.object().shape({
  checkIn: Yup.date()
    .required('Выберите дату заезда')
    .min(new Date(), 'Дата не может быть в прошлом'),
  checkOut: Yup.date()
    .required('Выберите дату выезда')
    .min(Yup.ref('checkIn'), 'Дата выезда должна быть после даты заезда'),
});

const RoomDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  // Placeholder изображения
  const placeholderImage =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';

  // Генерация дополнительных изображений для галереи, если их недостаточно
  const generateImages = mainImage => {
    return [
      mainImage,
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1739&q=80',
    ];
  };

  useEffect(() => {
    console.log('RoomDetailPage: Загрузка комнаты с ID:', id);

    const fetchRoom = async () => {
      try {
        console.log('Отправка запроса к API для комнаты с ID:', id);
        const response = await roomService.getRoomById(id);
        console.log('Получен ответ от API:', response.data);
        setRoom(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке номера:', err);
        setError('Не удалось загрузить информацию о номере');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleImageChange = index => {
    setSelectedImage(index);
  };

  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleSubmit = (values, { setSubmitting, setStatus: formikSetStatus }) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      setSubmitting(false);
      return;
    }

    const bookingData = {
      roomId: id,
      checkIn: values.checkIn.toISOString(),
      checkOut: values.checkOut.toISOString(),
      adults: room.capacity, // Используем вместимость номера как кол-во взрослых по умолчанию
      children: 0, // По умолчанию без детей
      specialRequests: '',
      totalPrice: calculateTotalPrice(room, values.checkIn, values.checkOut),
    };

    bookingService
      .createBooking(bookingData)
      .then(response => {
        // Устанавливаем статус как в Formik, так и в компоненте
        const successStatus = {
          type: 'success',
          message: 'Бронирование успешно создано!',
        };
        formikSetStatus(successStatus);
        setStatus(successStatus);

        // Перенаправление на страницу с деталями бронирования
        setTimeout(() => {
          navigate(`/bookings/${response.data.id}`);
        }, 2000);
      })
      .catch(error => {
        console.error('Ошибка при создании бронирования:', error);
        const errorStatus = {
          type: 'error',
          message:
            error.response?.data?.message ||
            'Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.',
        };
        formikSetStatus(errorStatus);
        setStatus(errorStatus);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const calculateTotalPrice = (room, checkIn, checkOut) => {
    const days = calculateDays(checkIn, checkOut);
    return room.price * days;
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Загрузка данных о номере...</div>
      </PageContainer>
    );
  }

  if (error || !room) {
    return (
      <PageContainer>
        <BackLink to="/rooms">
          <i className="fas fa-chevron-left"></i> Назад к списку номеров
        </BackLink>
        <div>{error || 'Номер не найден'}</div>
      </PageContainer>
    );
  }

  // Преобразование типа номера для отображения
  const roomTypeNames = {
    standard: 'Стандарт',
    deluxe: 'Делюкс',
    suite: 'Люкс',
    family: 'Семейный',
    executive: 'Премиум',
  };

  // Создание массива изображений с учетом организованной структуры
  const getRoomImages = (roomId) => {
    switch(roomId) {
      case '1': // 2-местный эконом
        return [
          '/images/rooms/2eco/room1.jpg',
          '/images/rooms/2eco/room2.jpg',
          '/images/rooms/2eco/room3.jpg',
          '/images/rooms/2eco/room4.jpg',
          '/images/rooms/2eco/room5.jpg',
        ];
      case '2': // 2-местный семейный
        return [
          '/images/rooms/2semeiny/room1.jpg',
          '/images/rooms/2semeiny/room2.jpg',
          '/images/rooms/2semeiny/room3.jpg',
          '/images/rooms/2semeiny/room4.jpg',
          '/images/rooms/2semeiny/room5.jpg',
        ];
      case '3': // 4-местный эконом
        return [
          '/images/rooms/4eco/room1.jpg',
          '/images/rooms/4eco/room2.jpg',
          '/images/rooms/4eco/room3.jpg',
          '/images/rooms/4eco/room4.jpg',
          '/images/rooms/4eco/room5.jpg',
        ];
      case '4': // Конференц-зал
        return [
          '/images/rooms/konf/room1.jpg',
          '/images/rooms/konf/room2.jpg',
          '/images/rooms/konf/room3.jpg',
          '/images/rooms/konf/room4.jpg',
          '/images/rooms/konf/room5.jpg',
        ];
      case '5': // Сауна
        return [
          '/images/rooms/sauna/room1.jpg',
          '/images/rooms/sauna/room2.jpg',
          '/images/rooms/sauna/room3.jpg',
          '/images/rooms/sauna/room4.jpg',
          '/images/rooms/sauna/room5.jpg',
        ];
      default:
        return room.images && room.images.length > 0 ? room.images : generateImages(placeholderImage);
    }
  };

  // Создание массива изображений
  const roomImages = getRoomImages(id);

  // Дополнительные удобства, если они отсутствуют в данных
  const defaultAmenities = [
    'Бесплатный Wi-Fi',
    'Кондиционер',
    'Телевизор',
    'Холодильник',
    'Сейф',
    'Фен',
    'Ванные принадлежности',
  ];

  const amenities = room.amenities && room.amenities.length > 0 ? room.amenities : defaultAmenities;

  return (
    <PageContainer>
      <BackLink to="/rooms">
        <i className="fas fa-chevron-left"></i> Назад к списку номеров
      </BackLink>

      {status && (
        <StatusMessage type={status.type}>
          <i
            className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}
          ></i>
          {status.message}
        </StatusMessage>
      )}

      <MainContent>
        <div>
          <RoomGallery>
            <MainImage>
              <img src={roomImages[selectedImage]} alt={room.name} />
            </MainImage>
            <ThumbnailsContainer>
              {roomImages.map((image, index) => (
                <Thumbnail
                  key={index}
                  active={selectedImage === index}
                  onClick={() => handleImageChange(index)}
                >
                  <img src={image} alt={`${room.name} - изображение ${index + 1}`} />
                </Thumbnail>
              ))}
            </ThumbnailsContainer>
          </RoomGallery>

          <RoomDetails>
            <RoomTitle>{room.name}</RoomTitle>

            <div>
              <RoomType>{roomTypeNames[room.roomType] || room.roomType}</RoomType>
              <RoomNumber>
                <i className="fas fa-door-open"></i> Номер {room.roomNumber}
              </RoomNumber>
            </div>

            <RoomPrice>
              {room.price.toLocaleString()} ₽ <span>за ночь</span>
            </RoomPrice>

            <RoomDescription>
              <p>
                {room.description ||
                  `Уютный ${roomTypeNames[room.roomType].toLowerCase()} номер с современным дизайном и всеми необходимыми удобствами для комфортного проживания. Наслаждайтесь прекрасным видом и качественным сервисом.`}
              </p>
              {room.id === 1 && (
                <>
                  <p>
                    Двухместный эконом, в основном, заказывают те, кто приехал один. Номерного фонда достаточно, чтобы не подселять соседей. Подойдет для пары друзей или коллег одного пола. Или для семейной пары в ссоре - пока один любуется парком с балкона, другой озлобленно пьет чай. При низкой цене проживания, в номере есть все необходимое для удобства.
                  </p>
                  <p>
                    <strong>В номере:</strong><br />
                    Wi-Fi<br />
                    Телевизор<br />
                    Душ<br />
                    Туалетные принадлежности<br />
                    Холодильник<br />
                    Чайник<br />
                    Бутилированная вода при заезде
                  </p>
                  <p>
                    <strong>Стоимость:</strong><br />
                    За одного человека: 2500 руб/сутки<br />
                    За двух человек: 3000 руб/сутки<br />
                    Возможна б/н оплата
                  </p>
                </>
              )}
              {room.id === 2 && (
                <>
                  <p>
                    Двухместный семейный номер-стандарт оснащен одной двуспальной кроватью, что подразумевает заселение пары или одиночки, любящего отдыхать с комфортом. Удобные кресла, стол, большая площадь, шикарный вид из окна - все способствует приятному времяпрепровождению.
                  </p>
                  <p>
                    <strong>В номере:</strong><br />
                    Wi-Fi<br />
                    Телевизор<br />
                    Душ<br />
                    Туалетные принадлежности<br />
                    Холодильник<br />
                    Чайник<br />
                    Бутилированная вода при заезде
                  </p>
                  <p>
                    <strong>Стоимость:</strong><br />
                    3800 руб/сутки<br />
                    Возможна б/н оплата
                  </p>
                </>
              )}
            </RoomDescription>

            <InfoGrid>
              <InfoItem>
                <i className="fas fa-user"></i>
                <div>
                  <span>Вместимость</span>
                  <span>
                    {room.capacity} {room.capacity === 1 ? 'гость' : 'гостей'}
                  </span>
                </div>
              </InfoItem>
              <InfoItem>
                <i className="fas fa-building"></i>
                <div>
                  <span>Этаж</span>
                  <span>{room.floor || 1}</span>
                </div>
              </InfoItem>
              <InfoItem>
                <i className="fas fa-expand"></i>
                <div>
                  <span>Площадь</span>
                  <span>{room.area || '25'} м²</span>
                </div>
              </InfoItem>
              <InfoItem>
                <i className="fas fa-bed"></i>
                <div>
                  <span>Кровати</span>
                  <span>{room.beds || '1 двуспальная'}</span>
                </div>
              </InfoItem>
            </InfoGrid>

            <SectionTitle>Удобства и сервисы</SectionTitle>
            <AmenitiesList>
              {amenities.map((amenity, index) => (
                <AmenityItem key={index}>
                  <i className="fas fa-check-circle"></i>
                  <span>{amenity}</span>
                </AmenityItem>
              ))}
            </AmenitiesList>
          </RoomDetails>
        </div>

        <aside>
          <BookingBox>
            <h3>Забронировать номер</h3>

            {isAuthenticated ? (
              <Formik
                initialValues={{
                  checkIn: new Date(),
                  checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
                }}
                validationSchema={bookingSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting, status: formikStatus }) => {
                  const calculatedDays = calculateDays(values.checkIn, values.checkOut);
                  return (
                    <Form>
                      {formikStatus && (
                        <StatusMessage type={formikStatus.type}>
                          <i
                            className={`fas ${formikStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}
                          ></i>
                          {formikStatus.message}
                        </StatusMessage>
                      )}

                      <BookingDate>
                        <label htmlFor="checkIn">Дата заезда</label>
                        <StyledDatePicker
                          id="checkIn"
                          selected={values.checkIn}
                          onChange={date => {
                            setFieldValue('checkIn', date);
                          }}
                          selectsStart
                          startDate={values.checkIn}
                          endDate={values.checkOut}
                          minDate={new Date()}
                          dateFormat="dd.MM.yyyy"
                        />
                        <ErrorMessage name="checkIn" component={Error} />
                      </BookingDate>

                      <BookingDate>
                        <label htmlFor="checkOut">Дата выезда</label>
                        <StyledDatePicker
                          id="checkOut"
                          selected={values.checkOut}
                          onChange={date => {
                            setFieldValue('checkOut', date);
                          }}
                          selectsEnd
                          startDate={values.checkIn}
                          endDate={values.checkOut}
                          minDate={values.checkIn}
                          dateFormat="dd.MM.yyyy"
                        />
                        <ErrorMessage name="checkOut" component={Error} />
                      </BookingDate>

                      <TotalPrice>
                        <span>
                          Итого за {calculatedDays}{' '}
                          {calculatedDays === 1 ? 'ночь' : calculatedDays < 5 ? 'ночи' : 'ночей'}
                        </span>
                        <span>{(room.price * calculatedDays).toLocaleString()} ₽</span>
                      </TotalPrice>

                      <BookButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Бронирование...' : 'Забронировать'}
                      </BookButton>
                    </Form>
                  );
                }}
              </Formik>
            ) : (
              <LoginPrompt>
                <p>Для бронирования необходимо войти в систему</p>
                <div>
                  <LoginButton to="/login">Войти</LoginButton>
                  <RegisterButton to="/register">Регистрация</RegisterButton>
                </div>
              </LoginPrompt>
            )}
          </BookingBox>
        </aside>
      </MainContent>
    </PageContainer>
  );
};

export default RoomDetailPage;
