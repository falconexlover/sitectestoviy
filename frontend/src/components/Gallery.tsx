import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
}

interface GalleryProps {
  images?: GalleryImage[];
}

interface StyledButtonProps {
  active: boolean;
  direction?: 'prev' | 'next';
}

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const GalleryFilter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  background-color: ${props => (props.active ? 'var(--primary-color)' : 'transparent')};
  color: ${props => (props.active ? 'white' : 'var(--dark-color)')};
  border: 2px solid var(--primary-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;

  &:hover {
    background-color: ${props => (!props.active ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--primary-dark-color)')};
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const GalleryItem = styled.div`
  position: relative;
  height: 250px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 1001;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #f0f0f0;
  }
`;

const NavButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;')}
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 1001;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const Gallery: React.FC<GalleryProps> = ({ images: propImages }) => {
  const defaultImages: GalleryImage[] = [
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
      url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      alt: '2-местный семейный',
      category: 'rooms',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      alt: '4-местный эконом',
      category: 'rooms',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      alt: 'Сауна',
      category: 'sauna',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80',
      alt: 'Конференц-зал',
      category: 'conference',
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1588351829772-9844a0e9037f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      alt: 'Территория',
      category: 'territory',
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      alt: 'Холл гостиницы',
      category: 'interior',
    },
  ];

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);

  // Используем пользовательские изображения или заглушку, если они не предоставлены
  useEffect(() => {
    setImages(propImages || defaultImages);
  }, [propImages]);

  // Получаем уникальные категории из изображений
  useEffect(() => {
    if (images.length > 0) {
      const uniqueCategories = Array.from(new Set(images.map(img => img.category)));
      setCategories(uniqueCategories);
    }
  }, [images]);

  // Фильтруем изображения по выбранной категории
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === activeFilter));
    }
  }, [activeFilter, images]);

  // Обработчик нажатия на изображение
  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Перейти к предыдущему изображению
  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(filteredImages[currentIndex - 1]);
    } else {
      setCurrentIndex(filteredImages.length - 1);
      setSelectedImage(filteredImages[filteredImages.length - 1]);
    }
  };

  // Перейти к следующему изображению
  const handleNextImage = () => {
    if (currentIndex < filteredImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else {
      setCurrentIndex(0);
      setSelectedImage(filteredImages[0]);
    }
  };

  // Обработчик нажатия клавиш для навигации
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case 'Escape':
          handleCloseModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, filteredImages]);

  return (
    <GalleryContainer>
      <GalleryFilter>
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          Все
        </FilterButton>
        {categories.map((category, index) => (
          <FilterButton
            key={index}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
          >
            {category === 'rooms' && 'Номера'}
            {category === 'exterior' && 'Экстерьер'}
            {category === 'interior' && 'Интерьер'}
            {category === 'sauna' && 'Сауна'}
            {category === 'conference' && 'Конференц-зал'}
            {category === 'territory' && 'Территория'}
            {!['rooms', 'exterior', 'interior', 'sauna', 'conference', 'territory'].includes(category) && category}
          </FilterButton>
        ))}
      </GalleryFilter>

      <GalleryGrid>
        {filteredImages.map((image, index) => (
          <GalleryItem key={image.id} onClick={() => handleImageClick(image, index)}>
            <GalleryImage src={image.url} alt={image.alt} />
            <ImageCaption>{image.alt}</ImageCaption>
          </GalleryItem>
        ))}
      </GalleryGrid>

      {selectedImage && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <NavButton direction="prev" onClick={handlePrevImage}>
              &lt;
            </NavButton>
            <NavButton direction="next" onClick={handleNextImage}>
              &gt;
            </NavButton>
            <ModalImage src={selectedImage.url} alt={selectedImage.alt} />
            <ImageCaption>{selectedImage.alt}</ImageCaption>
          </ModalContent>
        </ModalOverlay>
      )}
    </GalleryContainer>
  );
};

export default Gallery; 