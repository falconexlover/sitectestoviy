import React from 'react';
import styled from 'styled-components';

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const ServiceImage = styled.div`
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${ServiceCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ServiceContent = styled.div`
  padding: 1.5rem;
`;

const ServiceTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--dark-color);
  margin-bottom: 0.8rem;
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

const ServiceDescription = styled.p`
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ServicePrice = styled.div`
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 1rem;
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  margin: 1rem 0;
  padding: 0;
`;

const ServiceFeatureItem = styled.li`
  padding: 0.3rem 0;
  display: flex;
  align-items: center;

  &::before {
    content: '✓';
    color: var(--success-color);
    margin-right: 0.5rem;
    font-weight: bold;
  }
`;

const CtaSection = styled.div`
  background:
    linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
    url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80')
      center/cover no-repeat;
  padding: 4rem 2rem;
  color: white;
  text-align: center;
  border-radius: var(--radius-md);

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    max-width: 600px;
    margin: 0 auto 2rem auto;
    font-size: 1.1rem;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const Button = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  border: 2px solid transparent;

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ServicePage = () => {
  const services = [
    {
      id: 1,
      title: 'Ресторан "Лесная трапеза"',
      description:
        'Насладитесь изысканными блюдами из местных, экологически чистых продуктов в нашем ресторане с видом на лес.',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: [
        'Авторское меню от шеф-повара',
        'Панорамные окна с видом на лес',
        'Уникальные блюда из локальных продуктов',
        'Завтрак включен в стоимость проживания',
      ],
      price: 'От 1500 ₽ с человека',
    },
    {
      id: 2,
      title: 'СПА-центр "Лесное спокойствие"',
      description:
        'Восстановите силы и избавьтесь от стресса в нашем СПА-центре с натуральными процедурами и профессиональными мастерами.',
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: [
        'Различные виды массажа',
        'Сауна и хаммам',
        'Косметические процедуры',
        'Специальные СПА-программы',
      ],
      price: 'От 2500 ₽ за сеанс',
    },
    {
      id: 3,
      title: 'Конференц-зал "Деловой лес"',
      description:
        'Организуйте деловые встречи, корпоративные мероприятия или семинары в нашем современном конференц-зале.',
      image:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      features: [
        'Вместимость до 50 человек',
        'Современное аудио-видео оборудование',
        'Высокоскоростной Wi-Fi',
        'Кофе-брейки и фуршеты',
      ],
      price: 'От 5000 ₽ за час',
    },
    {
      id: 4,
      title: 'Прогулки по лесу с гидом',
      description:
        'Узнайте больше о местной природе и истории во время экскурсий с нашими опытными гидами.',
      image:
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1441&q=80',
      features: [
        'Маршруты разной сложности',
        'Знакомство с местной флорой и фауной',
        'Фотографирование живописных мест',
        'Подходит для всей семьи',
      ],
      price: 'От 800 ₽ с человека',
    },
    {
      id: 5,
      title: 'Велопрокат',
      description:
        'Исследуйте окрестности на велосипеде, воспользовавшись нашим сервисом проката велосипедов различных типов.',
      image:
        'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: [
        'Горные и городские велосипеды',
        'Детские велосипеды и сиденья',
        'Шлемы и защитное снаряжение',
        'Карты веломаршрутов',
      ],
      price: 'От 500 ₽ в час',
    },
    {
      id: 6,
      title: 'Детская площадка и анимация',
      description:
        'Отдыхайте спокойно, пока ваши дети весело проводят время с нашими аниматорами и на детской площадке.',
      image:
        'https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      features: [
        'Безопасная игровая площадка',
        'Развлекательные программы',
        'Творческие мастер-классы',
        'Профессиональные аниматоры',
      ],
      price: 'Входит в стоимость проживания',
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Услуги отеля "Лесной Дворик"</PageTitle>
        <PageSubtitle>
          Мы предлагаем широкий спектр услуг, чтобы сделать ваш отдых максимально комфортным и
          запоминающимся
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
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, index) => (
                  <ServiceFeatureItem key={index}>{feature}</ServiceFeatureItem>
                ))}
              </ServiceFeatures>
              <ServicePrice>{service.price}</ServicePrice>
            </ServiceContent>
          </ServiceCard>
        ))}
      </ServicesGrid>

      <CtaSection>
        <h2>Нужна дополнительная информация?</h2>
        <p>Свяжитесь с нами, чтобы узнать больше о наших услугах или забронировать их заранее</p>
        <Button href="/contacts">Связаться с нами</Button>
      </CtaSection>
    </PageContainer>
  );
};

export default ServicePage;
