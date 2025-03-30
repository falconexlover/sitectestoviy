import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faWater, faUtensils, faSpa, faUsers, faDisplay, faChalkboard } from '@fortawesome/free-solid-svg-icons';

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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const ServiceImage = styled.div`
  height: 300px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ServiceContent = styled.div`
  padding: 2rem;
`;

const ServiceTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 1rem;
`;

const ServicePrice = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const ServiceDescription = styled.p`
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ServiceFeatures = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 0;
  list-style: none;
`;

const ServiceFeature = styled.li`
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  
  svg {
    color: var(--primary-color);
    margin-right: 10px;
  }
`;

const BookButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: var(--dark-color);
    transform: translateY(-2px);
  }
`;

const BookingSection = styled.div`
  background-color: var(--light-color);
  padding: 3rem;
  border-radius: var(--radius-md);
  margin-top: 4rem;
  text-align: center;

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--dark-color);
    margin-bottom: 1.5rem;
  }

  p {
    max-width: 700px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

const ServicePage = () => {
  const services = [
    {
      id: 1,
      title: 'Сауна',
      description: 'Сауна с купелью и двумя парилками - сухой и русской. Просторная комната отдыха для релакса.',
      price: '1275 ₽/час',
      features: [
        { icon: faWater, text: 'Купель 18-20°C' },
        { icon: faUtensils, text: 'Возможен заказ еды' },
        { icon: faSpa, text: 'Два вида парных' },
      ],
      image: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      link: '/booking/sauna',
    },
    {
      id: 2,
      title: 'Конференц-зал',
      description: 'Просторный конференц-зал 62 кв.м на 2 этаже. Светлое помещение с оборудованием для презентаций.',
      price: '1500 ₽/час',
      features: [
        { icon: faUsers, text: 'Вместимость до 40 человек' },
        { icon: faDisplay, text: 'Проектор, экран, флип-чарт' },
        { icon: faChalkboard, text: 'Конференц-оборудование' },
      ],
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80',
      link: '/booking/conference',
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Дополнительные услуги</PageTitle>
        <PageSubtitle>
          Сауна и конференц-зал для вашего отдыха и деловых мероприятий
        </PageSubtitle>
      </PageHeader>

      <ServicesGrid>
        {services.map(service => (
          <ServiceCard key={service.id}>
            <ServiceImage>
              <img src={service.image} alt={service.title} />
            </ServiceImage>
            <ServiceContent>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServicePrice>{service.price}</ServicePrice>
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, index) => (
                  <ServiceFeature key={index}>
                    <FontAwesomeIcon icon={feature.icon} />
                    <span>{feature.text}</span>
                  </ServiceFeature>
                ))}
              </ServiceFeatures>
              <BookButton to={service.link}>Забронировать</BookButton>
            </ServiceContent>
          </ServiceCard>
        ))}
      </ServicesGrid>

      <BookingSection>
        <h2>Как забронировать услуги</h2>
        <p>
          Для бронирования сауны или конференц-зала вы можете воспользоваться формой онлайн-бронирования или связаться с нами по телефону:
        </p>
        <p>
          <strong>Сауна:</strong> 8 (915) 120 17 44<br />
          <strong>Конференц-зал:</strong> 8 (916) 926 65 14
        </p>
        <BookButton to="/booking">Перейти к бронированию</BookButton>
      </BookingSection>
    </PageContainer>
  );
};

export default ServicePage;
