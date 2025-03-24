import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { roomService } from '../services/api';
import RoomCard from '../components/RoomCard';

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80') center/cover;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 1rem;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButton = styled(Link)`
  background-color: #003366;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background-color: #002244;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: #003366;
  }
`;

const FeaturedRooms = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const AboutContent = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AboutImage = styled.img`
  width: 40%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AboutText = styled.div`
  flex: 1;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #003366;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await roomService.getRooms();
        // Берем только первые 3 номера для отображения на главной
        setFeaturedRooms(response.data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить номера');
        setLoading(false);
        console.error('Ошибка при загрузке номеров:', err);
      }
    };
    
    fetchFeaturedRooms();
  }, []);
  
  return (
    <div>
      <HeroSection>
        <HeroTitle>Добро пожаловать в "Лесной Дворик"</HeroTitle>
        <HeroSubtitle>
          Уютный гостиничный комплекс в живописном месте, где вы сможете отдохнуть 
          от городской суеты и насладиться красотой природы
        </HeroSubtitle>
        <HeroButton to="/rooms">Забронировать номер</HeroButton>
      </HeroSection>
      
      <Section>
        <SectionTitle>Наши лучшие номера</SectionTitle>
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <FeaturedRooms>
            {featuredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </FeaturedRooms>
        )}
      </Section>
      
      <Section>
        <SectionTitle>О нас</SectionTitle>
        <AboutContent>
          <AboutImage 
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" 
            alt="О гостиничном комплексе" 
          />
          <AboutText>
            <h3>Комфорт и уют в окружении природы</h3>
            <p>
              Гостиничный комплекс "Лесной Дворик" расположен в живописном месте, 
              окруженном хвойным лесом. У нас вы сможете насладиться чистым воздухом, 
              тишиной и красотой природы.
            </p>
            <p>
              Мы предлагаем комфортабельные номера различных категорий, оснащенные 
              всем необходимым для приятного отдыха. На территории комплекса есть 
              ресторан с блюдами местной кухни, спа-центр и различные развлечения.
            </p>
            <p>
              Идеальное место для семейного отдыха, романтического уикенда или 
              корпоративного мероприятия.
            </p>
          </AboutText>
        </AboutContent>
      </Section>
      
      <Section>
        <SectionTitle>Наши преимущества</SectionTitle>
        <FeaturesList>
          <FeatureItem>
            <FeatureIcon>🌳</FeatureIcon>
            <FeatureTitle>Живописное расположение</FeatureTitle>
            <p>Окружение хвойного леса, чистый воздух и красивые виды</p>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>🛏️</FeatureIcon>
            <FeatureTitle>Комфортные номера</FeatureTitle>
            <p>Уютные номера различных категорий с современной мебелью</p>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>🍽️</FeatureIcon>
            <FeatureTitle>Ресторан</FeatureTitle>
            <p>Блюда местной и европейской кухни из свежих продуктов</p>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>💆‍♀️</FeatureIcon>
            <FeatureTitle>Спа-центр</FeatureTitle>
            <p>Сауна, бассейн и различные оздоровительные процедуры</p>
          </FeatureItem>
        </FeaturesList>
      </Section>
    </div>
  );
};

export default HomePage; 