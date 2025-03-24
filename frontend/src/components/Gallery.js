import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const GallerySection = styled.section`
  padding: 5rem 0;
  background-color: var(--light-color);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
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

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--dark-color);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  height: ${props => props.featured ? '400px' : '250px'};
  grid-column: ${props => props.featured ? 'span 2' : 'span 1'};
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    
    img {
      transform: scale(1.05);
    }
    
    .overlay {
      opacity: 1;
    }
  }
  
  @media (max-width: 992px) {
    grid-column: span 1;
    height: 250px;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
`;

const GalleryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  h3 {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
  }
`;

const ViewButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  i {
    color: var(--primary-color);
    font-size: 1.2rem;
  }
  
  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90vh;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const LightboxCaption = styled.div`
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  color: white;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: -50px' : 'right: -50px'};
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 992px) {
    ${props => props.direction === 'prev' ? 'left: -30px' : 'right: -30px'};
    font-size: 1.5rem;
  }
`;

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const galleryItems = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Уютный интерьер',
      description: 'Комфортная атмосфера для вашего отдыха',
      featured: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Современный номер',
      description: 'Стильный дизайн и все удобства'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
      title: 'Просторная ванная',
      description: 'Современная сантехника и аксессуары'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Вид из окна',
      description: 'Панорамные виды на природу'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1739&q=80',
      title: 'Зона отдыха',
      description: 'Место для релаксации и общения'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      title: 'Территория',
      description: 'Зелёный уголок для прогулок',
      featured: true
    }
  ];
  
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    // Предотвращаем прокрутку страницы при открытом лайтбоксе
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    // Восстанавливаем прокрутку страницы
    document.body.style.overflow = 'auto';
  };
  
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };
  
  // Обработчик клавиш для навигации в лайтбоксе с помощью useCallback
  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'ArrowLeft') {
      prevImage(e);
    } else if (e.key === 'ArrowRight') {
      nextImage(e);
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  }, [lightboxOpen]);
  
  // Добавляем слушатель событий клавиатуры при монтировании компонента
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <GallerySection id="gallery">
      <Container>
        <SectionHeader>
          <SectionTitle>Галерея</SectionTitle>
          <SectionSubtitle>
            Погрузитесь в атмосферу отеля "Лесной Дворик" через нашу фотогалерею
          </SectionSubtitle>
        </SectionHeader>
        
        <GalleryGrid>
          {galleryItems.map((item, index) => (
            <GalleryItem key={item.id} featured={item.featured}>
              <GalleryImage src={item.image} alt={item.title} />
              <GalleryOverlay className="overlay">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </GalleryOverlay>
              <ViewButton onClick={() => openLightbox(index)}>
                <i className="fas fa-search-plus"></i>
              </ViewButton>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>
      
      <LightboxOverlay isOpen={lightboxOpen} onClick={closeLightbox}>
        <LightboxContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeLightbox}>
            <i className="fas fa-times"></i>
          </CloseButton>
          <LightboxImage 
            src={galleryItems[currentImage].image} 
            alt={galleryItems[currentImage].title} 
          />
          <LightboxCaption>
            <h3>{galleryItems[currentImage].title}</h3>
            <p>{galleryItems[currentImage].description}</p>
          </LightboxCaption>
          <NavigationButton direction="prev" onClick={prevImage}>
            <i className="fas fa-chevron-left"></i>
          </NavigationButton>
          <NavigationButton direction="next" onClick={nextImage}>
            <i className="fas fa-chevron-right"></i>
          </NavigationButton>
        </LightboxContent>
      </LightboxOverlay>
    </GallerySection>
  );
};

export default Gallery; 