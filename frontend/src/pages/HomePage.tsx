import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faWifi, faParking, faTrain, faHotel, faUserTie } from '@fortawesome/free-solid-svg-icons';

interface ServiceCardProps {
  icon: typeof faLeaf;
  title: string;
  description: string;
}

interface RoomCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  features: string[];
}

// Типизация для слайдера
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
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ServiceCardContainer = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: 2rem;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
`;

const ServiceIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const ServiceDescription = styled.p`
  color: var(--text-color);
  line-height: 1.7;
`;

const RoomsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const RoomCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
`;

const RoomImage = styled.div`
  height: 220px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const RoomPrice = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
`;

const RoomContent = styled.div`
  padding: 1.5rem;
`;

const RoomTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const RoomDescription = styled.p`
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.7;
`;

const RoomFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const RoomFeature = styled.span`
  background-color: var(--light-color);
  color: var(--dark-color);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RoomLink = styled(Link)`
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    color: var(--dark-color);
  }
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: white;
  color: var(--primary-color);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: var(--shadow-md);

  &:hover {
    background-color: var(--dark-color);
    color: white;
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
`;

const TestimonialsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const GallerySection = styled.section`
  padding: 5rem 0;
  background-color: var(--light-color);
`;

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <ServiceCardContainer>
      <ServiceIcon>
        <FontAwesomeIcon icon={icon} />
      </ServiceIcon>
      <ServiceTitle>{title}</ServiceTitle>
      <ServiceDescription>{description}</ServiceDescription>
    </ServiceCardContainer>
  );
};

const RoomCardComponent: React.FC<RoomCardProps> = ({ id, title, price, image, description, features }) => {
  return (
    <RoomCard>
      <RoomImage>
        <img src={image} alt={title} />
        <RoomPrice>от ${price}/ночь</RoomPrice>
      </RoomImage>
      <RoomContent>
        <RoomTitle>{title}</RoomTitle>
        <RoomDescription>{description}</RoomDescription>
        <RoomFeatures>
          {features.map((feature, index) => (
            <RoomFeature key={index}>{feature}</RoomFeature>
          ))}
        </RoomFeatures>
        <RoomLink to={`/rooms/${id}`}>Подробнее &rarr;</RoomLink>
      </RoomContent>
    </RoomCard>
  );
};

const HomePage: React.FC = () => {
  // Примеры избранных номеров
  const featuredRooms = [
    {
      id: '1',
      title: 'Стандартный номер',
      price: 99,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      description: 'Комфортабельный номер с великолепным видом и всеми необходимыми удобствами для вашего отдыха.',
      features: ['Бесплатный Wi-Fi', 'Кондиционер', 'Телевизор', 'Мини-бар']
    },
    {
      id: '2',
      title: 'Люкс с видом на море',
      price: 199,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      description: 'Просторный люкс с панорамным видом на море и дополнительными удобствами для особого комфорта.',
      features: ['Вид на море', 'Сейф', 'Джакузи', 'Завтрак включен']
    },
    {
      id: '3',
      title: 'Семейный номер',
      price: 149,
      image: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      description: 'Идеальный вариант для семейного отдыха с просторной гостиной и всеми необходимыми удобствами.',
      features: ['2 спальни', 'Гостиная', 'Детская кровать', 'Холодильник']
    }
  ];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>Добро пожаловать в наш уютный отель</HeroTitle>
            <HeroSubtitle>
              Насладитесь непревзойденным комфортом и роскошью в самом сердце города.
              Идеальное место для отдыха, работы и незабываемых впечатлений.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton to="/rooms">Наши номера</PrimaryButton>
              <SecondaryButton to="/contact">Связаться с нами</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </HeroContainer>
      </HeroSection>

      <AboutSection>
        <Container>
          <AboutGrid>
            <AboutImage>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="Отель"
              />
            </AboutImage>
            <AboutContent>
              <SectionSubtitle>О нас</SectionSubtitle>
              <SectionTitle>Роскошный отдых в сердце города</SectionTitle>
              <Paragraph>
                Наш отель предлагает исключительное сочетание комфорта, роскоши и первоклассного сервиса.
                Расположенный в самом сердце города, мы обеспечиваем идеальное место для отдыха и работы.
              </Paragraph>
              <Paragraph>
                С момента открытия в 2010 году, мы стремимся предоставить нашим гостям непревзойденный опыт
                пребывания, сочетая современные удобства с традиционным гостеприимством.
              </Paragraph>
              <FeatureList>
                <FeatureItem>
                  <FontAwesomeIcon icon={faLeaf} style={{ color: 'var(--primary-color)', marginRight: '10px' }} />
                  <span>Экологически чистые материалы</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon={faWifi} style={{ color: 'var(--primary-color)', marginRight: '10px' }} />
                  <span>Бесплатный высокоскоростной интернет</span>
                </FeatureItem>
                <FeatureItem>
                  <FontAwesomeIcon icon={faParking} style={{ color: 'var(--primary-color)', marginRight: '10px' }} />
                  <span>Парковка для гостей</span>
                </FeatureItem>
              </FeatureList>
              <PrimaryButton to="/about">Узнать больше</PrimaryButton>
            </AboutContent>
          </AboutGrid>
        </Container>
      </AboutSection>

      <ServicesSection>
        <Container>
          <SectionHeader>
            <SectionSubtitle>Наши услуги</SectionSubtitle>
            <SectionTitle>Премиальный сервис для наших гостей</SectionTitle>
            <Paragraph>
              Мы предлагаем широкий спектр услуг, чтобы сделать ваше пребывание у нас максимально комфортным и приятным.
              От спа-процедур до транспортных услуг, мы позаботимся о всех ваших потребностях.
            </Paragraph>
          </SectionHeader>

          <ServiceGrid>
            <ServiceCard
              icon={faHotel}
              title="Комфортное проживание"
              description="Наши номера оборудованы всем необходимым для вашего комфорта, включая премиальные постельные принадлежности и современную технику."
            />
            <ServiceCard
              icon={faUserTie}
              title="Персональный консьерж"
              description="Наши опытные консьержи помогут вам с планированием экскурсий, бронированием ресторанов и любыми другими потребностями."
            />
            <ServiceCard
              icon={faTrain}
              title="Трансфер от/до вокзала"
              description="Мы предлагаем удобные трансферы от и до вокзала или аэропорта, чтобы сделать ваше путешествие максимально комфортным."
            />
          </ServiceGrid>
        </Container>
      </ServicesSection>

      <RoomsSection>
        <Container>
          <SectionHeader>
            <SectionSubtitle>Наши номера</SectionSubtitle>
            <SectionTitle>Выберите номер для идеального отдыха</SectionTitle>
            <Paragraph>
              Мы предлагаем различные типы номеров, чтобы удовлетворить потребности каждого гостя.
              От стандартных номеров до роскошных люксов, каждый номер оформлен с вниманием к деталям.
            </Paragraph>
          </SectionHeader>

          <RoomGrid>
            {featuredRooms.map(room => (
              <RoomCardComponent
                key={room.id}
                id={room.id}
                title={room.title}
                price={room.price}
                image={room.image}
                description={room.description}
                features={room.features}
              />
            ))}
          </RoomGrid>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <CTAButton to="/rooms">Посмотреть все номера</CTAButton>
          </div>
        </Container>
      </RoomsSection>

      <TestimonialsSection>
        <Container>
          <SectionHeader>
            <SectionSubtitle>Отзывы</SectionSubtitle>
            <SectionTitle>Что говорят наши гости</SectionTitle>
            <Paragraph>
              Мы гордимся тем, что наши гости высоко оценивают наш сервис и гостеприимство.
              Вот некоторые отзывы от наших довольных гостей.
            </Paragraph>
          </SectionHeader>

          <Testimonials />
        </Container>
      </TestimonialsSection>

      <GallerySection>
        <Container>
          <SectionHeader>
            <SectionSubtitle>Галерея</SectionSubtitle>
            <SectionTitle>Взгляните на наш отель</SectionTitle>
            <Paragraph>
              Полюбуйтесь нашими фотографиями, чтобы получить представление о красоте и комфорте нашего отеля.
              От элегантных номеров до великолепных видов, мы предлагаем уникальный опыт пребывания.
            </Paragraph>
          </SectionHeader>

          <Gallery images={[]} />
        </Container>
      </GallerySection>

      <CTASection>
        <Container>
          <CTAContent>
            <CTATitle>Готовы забронировать свой идеальный отдых?</CTATitle>
            <CTADescription>
              Не упустите возможность насладиться непревзойденным комфортом и роскошью нашего отеля.
              Забронируйте номер сейчас и получите лучшие предложения!
            </CTADescription>
            <CTAButton to="/booking">Забронировать сейчас</CTAButton>
          </CTAContent>
        </Container>
      </CTASection>
    </>
  );
};

export default HomePage; 