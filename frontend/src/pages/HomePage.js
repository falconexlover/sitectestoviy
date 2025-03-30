import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faWifi, faParking, faTrain, faHotel, faUserTie } from '@fortawesome/free-solid-svg-icons';

const HeroSection = styled.section`
  height: 100vh;
  min-height: 600px;
  max-height: 800px;
  position: relative;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.7);
    z-index: -1;
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 650px;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  border: none;

  &:hover {
    background-color: var(--dark-color);
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: white;
    color: var(--dark-color);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const AboutSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const AboutImage = styled.div`
  position: relative;
  height: 500px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    width: 60%;
    height: 60%;
    border-radius: var(--radius-md);
    background-color: var(--light-color);
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 40%;
    height: 40%;
    border-radius: var(--radius-md);
    background-color: var(--primary-color);
    opacity: 0.1;
    z-index: -1;
  }

  @media (max-width: 992px) {
    height: 400px;
  }
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionSubtitle = styled.span`
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: block;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--dark-color);
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Paragraph = styled.p`
  color: var(--text-color);
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  i {
    width: 30px;
    height: 30px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 1rem;
    font-size: 0.9rem;
  }

  span {
    font-weight: 500;
  }
`;

const ServicesSection = styled.section`
  padding: 5rem 0;
  background-color: var(--light-color);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const SectionDescription = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  text-align: center;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition);

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }

  i {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    display: inline-block;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--dark-color);
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const RoomsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const RoomCard = styled.div`
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  background-color: white;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);

    img {
      transform: scale(1.05);
    }
  }
`;

const RoomImage = styled.div`
  height: 240px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
`;

const RoomInfo = styled.div`
  padding: 1.5rem;
`;

const RoomTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const RoomDescription = styled.p`
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const RoomDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const RoomDetail = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-muted);

  i {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const RoomPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
  }
`;

const RoomButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  display: inline-block;

  &:hover {
    background-color: var(--dark-color);
    transform: translateY(-3px);
  }
`;

const CtaSection = styled.section`
  padding: 5rem 0;
  background-color: var(--primary-color);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: 0;
  }
`;

const CtaContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const CtaTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: white;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CtaDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CtaButton = styled(Link)`
  display: inline-block;
  padding: 1.25rem 2.5rem;
  background-color: white;
  color: var(--primary-color);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: var(--transition);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    background-color: var(--light-color);
  }
`;

const HomePage = () => {
  const testimonials = [
    {
      id: 1,
      text: 'Отличное место для отдыха в тихой лесной зоне. Очень понравилась атмосфера советской романтики. Обязательно вернёмся!',
      author: 'Анна П.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 2,
      text: 'Уютные номера, приветливый персонал. Сауна - отдельный бонус. Рекомендую для семейного отдыха.',
      author: 'Михаил К.',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      text: 'Провели конференцию в зале Лесного дворика. Всё на высшем уровне, спасибо за организацию!',
      author: 'Олег В., компания "Альфа"',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    },
  ];

  const features = [
    {
      icon: faLeaf,
      title: 'Лесопарковая зона',
      text: 'Расположение в экологически чистом месте, окружённом природой и свежим воздухом',
    },
    {
      icon: faWifi,
      title: 'Бесплатный Wi-Fi',
      text: 'На всей территории гостиничного комплекса доступен бесплатный высокоскоростной интернет',
    },
    {
      icon: faParking,
      title: 'Собственная парковка',
      text: 'Удобная парковка для гостей гостиницы, вы всегда найдете место для своего автомобиля',
    },
    {
      icon: faTrain,
      title: 'Близость транспорта',
      text: 'Недалеко от станции МЦД Отдых, в шаговой доступности от городской инфраструктуры',
    },
    {
      icon: faHotel,
      title: 'Комфортное проживание',
      text: 'Уютные номера различных категорий для вашего комфортного отдыха и проживания',
    },
    {
      icon: faUserTie,
      title: 'Отличный сервис',
      text: 'Внимательный персонал, который обеспечит комфортное пребывание в гостинице',
    },
  ];

  const rooms = [
    {
      id: 1,
      name: '2-местный эконом',
      description: 'Уютный номер с двумя отдельными кроватями, балконом и видом на парк',
      price: '2500 ₽/сутки',
      image: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      link: '/rooms/1',
    },
    {
      id: 2,
      name: '2-местный семейный',
      description: 'Двухместный семейный номер-стандарт с видом на парк из окна. Двуспальная кровать, 22 кв.м.',
      price: '3800 ₽/сутки',
      image: '/images/rooms/2semeiny/room1.jpg',
      capacity: 2,
      area: '22',
      beds: '1 двуспальная',
      link: '/rooms/2',
    },
    {
      id: 3,
      name: '4-местный эконом',
      description: 'Просторный номер с балконом, 2 комнаты, 4 односпальные кровати, душевая кабина и ванна',
      price: '5000 ₽/сутки',
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      link: '/rooms/3',
    },
  ];

  const services = [
    {
      id: 1,
      name: 'Сауна',
      description: 'Сауна с купелью и двумя парилками - сухой и русской',
      price: '1275 ₽/час',
      image: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      link: '/services/sauna',
    },
    {
      id: 2,
      name: 'Конференц-зал',
      description: 'Просторный зал 62 кв.м для проведения мероприятий',
      price: '1500 ₽/час',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80',
      link: '/services/conference',
    },
  ];

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      alt: 'Внешний вид гостиницы',
      category: 'exterior',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      alt: '2-местный эконом',
      category: 'rooms',
    },
    {
      id: 3,
      url: '/images/rooms/2semeiny/room1.jpg',
      alt: '2-местный семейный',
      category: 'rooms',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      alt: 'Сауна',
      category: 'sauna',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80',
      alt: 'Конференц-зал',
      category: 'conference',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      alt: '4-местный эконом',
      category: 'rooms',
    },
  ];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>Гостиничный комплекс «Лесной дворик»</HeroTitle>
            <HeroSubtitle>
              Уютная гостиница, конференц-зал и сауна в лесопарковой зоне города Жуковский
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton to="/rooms">Посмотреть номера</PrimaryButton>
              <SecondaryButton to="/booking">Забронировать</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </HeroContainer>
      </HeroSection>

      <AboutSection>
        <Container>
          <AboutGrid>
            <AboutImage>
              <img src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" alt="Гостиница Лесной дворик" />
            </AboutImage>
            <AboutContent>
              <SectionSubtitle>О гостинице</SectionSubtitle>
              <SectionTitle>Лесной дворик</SectionTitle>
              <Paragraph>
                Санаторий-профилакторий расположен в красивейшей лесопарковой зоне, сохраненной с начала века. Гостиница, конференц-зал, сауна в одном комплексе в городе Жуковский.
              </Paragraph>
              <Paragraph>
                Здание построено в 1979 году, в стиле советского постмодернизма. Использовалось как санаторий-профилакторий Жуковского машиностроительного завода. С 1991 года лечебные и оздоровительные процедуры больше не проводятся, зато комплекс прекрасно справляется с ролью отеля.
              </Paragraph>
              <FeatureList>
                <FeatureItem>
                  <FontAwesomeIcon icon={faLeaf} size="lg" style={{ color: 'white' }} />
                  <span>Расположение в лесопарковой зоне</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon={faTrain} size="lg" style={{ color: 'white' }} />
                  <span>Недалеко от ж/д станции МЦД Отдых</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon={faWifi} size="lg" style={{ color: 'white' }} />
                  <span>Бесплатный Wi-Fi на всей территории</span>
                </FeatureItem>
              </FeatureList>
              <PrimaryButton to="/about">Подробнее о нас</PrimaryButton>
            </AboutContent>
          </AboutGrid>
        </Container>
      </AboutSection>

      <ServicesSection>
        <Container>
          <SectionHeader>
            <SectionSubtitle>Преимущества</SectionSubtitle>
            <SectionTitle>Наши услуги</SectionTitle>
            <SectionDescription>
              Мы стремимся создать комфортные условия для вашего отдыха и предлагаем различные услуги для гостей
            </SectionDescription>
          </SectionHeader>
          <ServicesGrid>
            {features.map((feature, index) => (
              <ServiceCard key={index}>
                <FontAwesomeIcon icon={feature.icon} size="2x" style={{ color: 'var(--primary-color)' }} />
                <ServiceTitle>{feature.title}</ServiceTitle>
                <ServiceDescription>{feature.text}</ServiceDescription>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </ServicesSection>

      <RoomsSection>
        <Container>
          <SectionHeader>
            <SectionSubtitle>Размещение</SectionSubtitle>
            <SectionTitle>Номерной фонд</SectionTitle>
            <SectionDescription>
              Комфортные номера различных категорий для вашего отдыха
            </SectionDescription>
          </SectionHeader>
          <RoomGrid>
            {rooms.map(room => (
              <RoomCard key={room.id}>
                <RoomImage>
                  <img src={room.image} alt={room.name} />
                  <RoomPrice>{room.price}</RoomPrice>
                </RoomImage>
                <RoomInfo>
                  <RoomTitle>{room.name}</RoomTitle>
                  <RoomDescription>{room.description}</RoomDescription>
                  <RoomDetails>
                    <RoomDetail>
                      <FontAwesomeIcon icon="user" />
                      <span>{room.capacity} гостей</span>
                    </RoomDetail>
                    <RoomDetail>
                      <FontAwesomeIcon icon="expand" />
                      <span>{room.area} м²</span>
                    </RoomDetail>
                    <RoomDetail>
                      <FontAwesomeIcon icon="bed" />
                      <span>{room.beds}</span>
                    </RoomDetail>
                  </RoomDetails>
                  <RoomPrice>
                    <span>{room.price}</span>
                    <RoomButton to={room.link}>Подробнее</RoomButton>
                  </RoomPrice>
                </RoomInfo>
              </RoomCard>
            ))}
          </RoomGrid>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <PrimaryButton to="/rooms">Смотреть все номера</PrimaryButton>
          </div>
        </Container>
      </RoomsSection>

      <Gallery images={[]} />

      <Testimonials testimonials={testimonials} />

      <CtaSection>
        <CtaContainer>
          <CtaTitle>Забронируйте номер прямо сейчас</CtaTitle>
          <CtaDescription>
            Отдых в тихой лесопарковой зоне города Жуковский, в комфортных номерах с хорошим сервисом.
          </CtaDescription>
          <CtaButton to="/booking">Забронировать номер</CtaButton>
        </CtaContainer>
      </CtaSection>
    </>
  );
};

export default HomePage;
