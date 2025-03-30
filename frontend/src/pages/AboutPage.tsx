import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faWifi, faParking, faTrain, faHotel, faUserTie } from '@fortawesome/free-solid-svg-icons';

// Определяем интерфейсы для компонентов
interface StyleProps {
  active?: boolean;
  direction?: 'prev' | 'next';
}

// Определяем типы для элементов страницы
interface AboutContentProps {
  style?: React.CSSProperties;
}

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

const AboutSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AboutContent = styled.div<AboutContentProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
`;

const AboutImage = styled.div`
  height: 100%;
  min-height: 400px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  i {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    color: var(--dark-color);
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const TeamSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamMember = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MemberImage = styled.div`
  height: 260px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${TeamMember}:hover & img {
    transform: scale(1.05);
  }
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const MemberName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MemberBio = styled.p`
  color: var(--text-color);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const CtaSection = styled.div`
  background:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')
      center/cover no-repeat;
  padding: 4rem 2rem;
  color: white;
  text-align: center;
  border-radius: var(--radius-md);

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    max-width: 600px;
    margin: 0 auto 2rem auto;
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

interface ButtonProps {
  to: string;
}

const Button = styled(Link)<ButtonProps>`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>О гостиничном комплексе «Лесной дворик»</PageTitle>
        <PageSubtitle>
          Уютная гостиница в лесопарковой зоне города Жуковский
        </PageSubtitle>
      </PageHeader>

      <AboutSection>
        <AboutContent>
          <h2>Общая информация</h2>
          <p>
            Санаторий-профилакторий расположен в красивейшей лесопарковой зоне, сохраненной с начала века. Гостиница, конференц-зал, сауна в одном комплексе в городе Жуковский. «Лесной дворик» расположен недалеко от ж/д станции МЦД Отдых, в шаговой доступности от городской инфраструктуры и общественного транспорта.
          </p>
          <p>
            <strong>Тип объекта:</strong> Санаторий-профилакторий, гостиница<br />
            <strong>Месторасположение:</strong> Лесопарковая зона города Жуковский<br />
            <strong>Адрес:</strong> Московская область, г. Жуковский, ул. Нижегородская, д. 4
          </p>
        </AboutContent>
        
        <AboutImage>
          <img src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" alt="Гостиничный комплекс Лесной дворик" />
        </AboutImage>
      </AboutSection>

      <SectionTitle>История</SectionTitle>
      <AboutSection>
        <AboutImage>
          <img src="https://images.unsplash.com/photo-1588351829772-9844a0e9037f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" alt="История гостиницы" />
        </AboutImage>
        
        <AboutContent>
          <p>
            Здание построено в 1979 году, в стиле советского постмодернизма. Использовалось как санаторий-профилакторий Жуковского машиностроительного завода. С 1991 года лечебные и оздоровительные процедуры больше не проводятся, зато комплекс прекрасно справляется с ролью отеля.
          </p>
          <p>
            <strong>Архитектурные особенности:</strong><br />
            Атмосфера советской романтики - это не просто слова. Мозаика, лепнина, внешний облик - всё это тщательно сохраняется при ремонте и реконструкции.
          </p>
        </AboutContent>
      </AboutSection>

      <SectionTitle>Наши преимущества</SectionTitle>
      <ValueGrid>
        <ValueCard>
          <FontAwesomeIcon icon={faWifi} size="2x" style={{ color: 'var(--primary-color)' }} />
          <h3>Бесплатный Wi-Fi</h3>
          <p>На всей территории гостиничного комплекса доступен бесплатный высокоскоростной интернет</p>
        </ValueCard>
        
        <ValueCard>
          <FontAwesomeIcon icon={faParking} size="2x" style={{ color: 'var(--primary-color)' }} />
          <h3>Собственная парковка</h3>
          <p>Удобная парковка для гостей гостиницы, вы всегда найдете место для своего автомобиля</p>
        </ValueCard>
        
        <ValueCard>
          <FontAwesomeIcon icon={faLeaf} size="2x" style={{ color: 'var(--primary-color)' }} />
          <h3>Лесопарковая зона</h3>
          <p>Расположение в экологически чистом месте, окружённом природой и свежим воздухом</p>
        </ValueCard>
        
        <ValueCard>
          <FontAwesomeIcon icon={faTrain} size="2x" style={{ color: 'var(--primary-color)' }} />
          <h3>Близость транспорта</h3>
          <p>Недалеко от станции МЦД Отдых, в шаговой доступности от городской инфраструктуры</p>
        </ValueCard>
        
        <ValueCard>
          <FontAwesomeIcon icon={faHotel} size="2x" style={{ color: 'var(--primary-color)' }} />
          <h3>Комфортное проживание</h3>
          <p>Уютные номера различных категорий для вашего комфортного отдыха и проживания</p>
        </ValueCard>
        
        <ValueCard>
          <FontAwesomeIcon icon={faUserTie} size="2x" style={{ color: 'var(--primary-color)' }} />
          <h3>Отличный сервис</h3>
          <p>Внимательный персонал, который обеспечит комфортное пребывание в гостинице</p>
        </ValueCard>
      </ValueGrid>

      <SectionTitle>Отзывы наших гостей</SectionTitle>
      <TeamGrid>
        <TeamMember>
          <MemberInfo>
            <MemberName>Анна П.</MemberName>
            <MemberRole>★★★★★</MemberRole>
            <MemberBio>
              "Отличное место для отдыха в тихой лесной зоне. Очень понравилась атмосфера советской романтики. Обязательно вернёмся!"
            </MemberBio>
          </MemberInfo>
        </TeamMember>
        
        <TeamMember>
          <MemberInfo>
            <MemberName>Михаил К.</MemberName>
            <MemberRole>★★★★☆</MemberRole>
            <MemberBio>
              "Уютные номера, приветливый персонал. Сауна - отдельный бонус. Рекомендую для семейного отдыха."
            </MemberBio>
          </MemberInfo>
        </TeamMember>
        
        <TeamMember>
          <MemberInfo>
            <MemberName>Олег В., компания "Альфа"</MemberName>
            <MemberRole>★★★★★</MemberRole>
            <MemberBio>
              "Провели конференцию в зале Лесного дворика. Всё на высшем уровне, спасибо за организацию!"
            </MemberBio>
          </MemberInfo>
        </TeamMember>
      </TeamGrid>

      <SectionTitle>Контактная информация</SectionTitle>
      <AboutContent style={{ marginBottom: '2rem' }}>
        <p>
          <strong>Адрес:</strong> Московская область, г. Жуковский, ул. Нижегородская, д. 4<br />
          <strong>Телефоны:</strong><br />
          Гостиница: 8 (498) 483 19 41<br />
          Гостиница (моб.): 8 (915) 120 17 44<br />
          Сауна: 8 (915) 120 17 44<br />
          Конференц-зал: 8 (916) 926 65 14<br />
          <strong>Социальные сети:</strong><br />
          ВКонтакте: lesnoy_dvorik
        </p>
      </AboutContent>

      <CtaSection>
        <h2>Готовы забронировать номер?</h2>
        <p>Забронируйте номер сейчас и получите лучшие условия проживания в гостиничном комплексе «Лесной дворик».</p>
        <Button to="/booking">Забронировать</Button>
      </CtaSection>
    </PageContainer>
  );
};

export default AboutPage; 