import React, { useState } from 'react';
import styled from 'styled-components';
import Gallery from '../components/Gallery';

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

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  background-color: ${props => (props.active ? 'var(--primary-color)' : 'white')};
  color: ${props => (props.active ? 'white' : 'var(--text-color)')};
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props => (props.active ? 'var(--primary-color)' : 'var(--light-color)')};
    transform: translateY(-2px);
  }

  @media (max-width: 576px) {
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
  }
`;

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все фото' },
    { id: 'rooms', name: 'Номера' },
    { id: 'restaurant', name: 'Ресторан' },
    { id: 'spa', name: 'СПА' },
    { id: 'territory', name: 'Территория' },
    { id: 'activities', name: 'Развлечения' },
  ];

  const handleCategoryChange = categoryId => {
    setActiveCategory(categoryId);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Фотогалерея</PageTitle>
        <PageSubtitle>
          Погрузитесь в атмосферу нашего отеля через фотографии интерьеров, территории и окружающей
          природы
        </PageSubtitle>
      </PageHeader>

      <CategoryFilters>
        {categories.map(category => (
          <FilterButton
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </FilterButton>
        ))}
      </CategoryFilters>

      <Gallery />
    </PageContainer>
  );
};

export default GalleryPage;
