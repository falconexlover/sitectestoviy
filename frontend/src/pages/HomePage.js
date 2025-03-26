import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const featuredRooms = [
    {
      id: 1,
      name: 'Стандартный номер',
      description: 'Уютный номер с современным дизайном для комфортного пребывания.',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
      price: 4500,
      capacity: 2,
      area: 25,
      beds: '1 двуспальная',
    },
    {
      id: 2,
      name: 'Люкс',
      description: 'Просторный номер с отдельной гостиной и всеми необходимыми удобствами.',
      image:
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      price: 7500,
      capacity: 3,
      area: 40,
      beds: '1 king-size',
    },
    {
      id: 3,
      name: 'Семейный номер',
      description: 'Идеален для семейного отдыха, с дополнительной спальней для детей.',
      image:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      price: 8500,
      capacity: 4,
      area: 55,
      beds: '2 двуспальные',
    },
  ];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>Уютный отдых в отеле "Лесной Дворик"</HeroTitle>
            <HeroSubtitle>
              Откройте для себя идеальное место для отдыха и релаксации среди природы, с комфортными
              номерами и первоклассным сервисом.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton to="/rooms">Посмотреть номера</PrimaryButton>
              <SecondaryButton to="#about">Узнать больше</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </HeroContainer>
      </HeroSection>

      <AboutSection id="about">
        <Container>
          <AboutGrid>
            <AboutImage>
              <img
                src="https://images.unsplash.com/photo-1560624052-449f5ddf0c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="Лесной Дворик"
              />
            </AboutImage>
            <AboutContent>
              <SectionSubtitle>О нас</SectionSubtitle>
              <SectionTitle>Гостеприимство и комфорт в каждой детали</SectionTitle>
              <Paragraph>
                "Лесной Дворик" – это уютный отель, расположенный в живописном месте среди природы.
                Мы предлагаем нашим гостям комфортные номера, приветливый персонал и первоклассный
                сервис, чтобы сделать ваш отдых незабываемым.
              </Paragraph>
              <Paragraph>
                С момента открытия в 2010 году, наш отель остается любимым местом отдыха для многих
                семей и бизнес-путешественников, которые ценят комфорт, тишину и красоту окружающей
                природы.
              </Paragraph>
              <FeatureList>
                <FeatureItem>
                  <FontAwesomeIcon icon="check" />
                  <span>Современные и комфортные номера</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon="check" />
                  <span>Ресторан с изысканной кухней</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon="check" />
                  <span>Удобное расположение и парковка</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon="check" />
                  <span>Бесплатный Wi-Fi на всей территории</span>
                </FeatureItem>
              </FeatureList>
              <PrimaryButton to="/about">Подробнее о нас</PrimaryButton>
            </AboutContent>
          </AboutGrid>
        </Container>
      </AboutSection>

      <ServicesSection id="services">
        <Container>
          <SectionHeader>
            <SectionSubtitle>Наши услуги</SectionSubtitle>
            <SectionTitle>Что мы предлагаем</SectionTitle>
            <SectionDescription>
              В отеле "Лесной Дворик" мы стремимся сделать ваше пребывание максимально комфортным и
              предлагаем широкий спектр услуг
            </SectionDescription>
          </SectionHeader>

          <ServicesGrid>
            <ServiceCard>
              <FontAwesomeIcon icon="utensils" />
              <ServiceTitle>Ресторан</ServiceTitle>
              <ServiceDescription>
                Наш ресторан предлагает изысканные блюда русской и европейской кухни из свежих
                местных продуктов.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <FontAwesomeIcon icon="spa" />
              <ServiceTitle>СПА центр</ServiceTitle>
              <ServiceDescription>
                Расслабьтесь в нашем СПА центре с сауной, джакузи и широким выбором массажей и
                процедур.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <FontAwesomeIcon icon="dumbbell" />
              <ServiceTitle>Фитнес-зал</ServiceTitle>
              <ServiceDescription>
                Поддерживайте форму в нашем современном фитнес-зале, оснащенном новейшим
                оборудованием.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <FontAwesomeIcon icon="swimming-pool" />
              <ServiceTitle>Бассейн</ServiceTitle>
              <ServiceDescription>
                Насладитесь плаванием в нашем крытом бассейне с подогревом, доступным для гостей
                круглый год.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <FontAwesomeIcon icon="child" />
              <ServiceTitle>Детская площадка</ServiceTitle>
              <ServiceDescription>
                Для маленьких гостей предусмотрена детская площадка и игровая комната с
                анимационными программами.
              </ServiceDescription>
            </ServiceCard>

            <ServiceCard>
              <FontAwesomeIcon icon="concierge-bell" />
              <ServiceTitle>Консьерж-сервис</ServiceTitle>
              <ServiceDescription>
                Наш консьерж-сервис поможет вам организовать экскурсии, трансфер и решить любые
                вопросы во время пребывания.
              </ServiceDescription>
            </ServiceCard>
          </ServicesGrid>
        </Container>
      </ServicesSection>

      <RoomsSection id="rooms-preview">
        <Container>
          <SectionHeader>
            <SectionSubtitle>Номера</SectionSubtitle>
            <SectionTitle>Выберите свой идеальный номер</SectionTitle>
            <SectionDescription>
              Мы предлагаем различные категории номеров, чтобы удовлетворить потребности каждого
              гостя
            </SectionDescription>
          </SectionHeader>

          <RoomGrid>
            {featuredRooms.map(room => (
              <RoomCard key={room.id}>
                <RoomImage>
                  <img src={room.image} alt={room.name} />
                </RoomImage>
                <RoomInfo>
                  <RoomTitle>{room.name}</RoomTitle>
                  <RoomDescription>{room.description}</RoomDescription>
                  <RoomDetails>
                    <RoomDetail>
                      <FontAwesomeIcon icon="user" /> {room.capacity} гостей
                    </RoomDetail>
                    <RoomDetail>
                      <FontAwesomeIcon icon="expand" /> {room.area} м²
                    </RoomDetail>
                    <RoomDetail>
                      <FontAwesomeIcon icon="bed" /> {room.beds}
                    </RoomDetail>
                  </RoomDetails>
                  <RoomPrice>
                    <span>{room.price.toLocaleString()} ₽ / ночь</span>
                    <RoomButton to={`/rooms/${room.id}`}>Подробнее</RoomButton>
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

      <Gallery />

      <Testimonials />

      <CtaSection>
        <CtaContainer>
          <CtaTitle>Готовы забронировать идеальный отдых?</CtaTitle>
          <CtaDescription>
            Забронируйте номер прямо сейчас и получите лучшую цену, а также ряд дополнительных
            преимуществ для вашего незабываемого отдыха в "Лесном Дворике".
          </CtaDescription>
          <CtaButton to="/rooms">Забронировать номер</CtaButton>
        </CtaContainer>
      </CtaSection>
    </>
  );
};

export default HomePage;
