import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ImageWithFallback from './ImageWithFallback';

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 240px);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 200px);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, auto);
    gap: 1rem;
  }
`;

const MainImageContainer = styled.div`
  grid-column: span 2;
  grid-row: span 2;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.01);
  }
  
  @media (max-width: 576px) {
    grid-column: span 1;
    grid-row: span 1;
    height: 250px;
  }
`;

const ThumbnailContainer = styled.div`
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MoreImagesOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
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
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const LightboxContent = styled.div`
  position: relative;
  width: 80%;
  max-width: 1200px;
  height: 80vh;
  display: flex;
  flex-direction: column;
`;

const LightboxImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
`;

const LightboxControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  color: white;
`;

const LightboxButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CloseButton = styled(LightboxButton)`
  position: absolute;
  top: -2rem;
  right: 0;
  font-size: 1.5rem;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  
  &::-webkit-scrollbar {
    height: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: ${props => props.isActive ? 1 : 0.5};
  border: 2px solid ${props => props.isActive ? 'white' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const RoomGallery = ({ images, apiUrl, optimizedImages = [] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  // Обрабатываем массив изображений, если он передан как строка
  let processedImages = images || [];
  if (typeof processedImages === 'string') {
    try {
      processedImages = JSON.parse(processedImages);
    } catch (e) {
      processedImages = [];
    }
  }
  
  // Добавляем apiUrl к путям изображений, если оно предоставлено
  const formattedImages = processedImages.map(img => {
    if (apiUrl && !img.startsWith('http')) {
      return `${apiUrl}/uploads/rooms/${img}`;
    }
    return img;
  });
  
  // Если нет изображений, показываем плейсхолдер
  if (formattedImages.length === 0) {
    formattedImages.push('/images/room-placeholder.jpg');
  }
  
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку страницы
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Восстанавливаем прокрутку
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? formattedImages.length - 1 : prev - 1));
  };
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev === formattedImages.length - 1 ? 0 : prev + 1));
  };
  
  // Обработчик клавиш
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);
  
  // Определяем количество изображений для отображения в галерее
  const maxThumbnails = Math.min(4, formattedImages.length - 1);
  
  return (
    <>
      <Gallery>
        {/* Главное изображение */}
        <MainImageContainer onClick={() => openLightbox(0)}>
          <ImageWithFallback
            src={formattedImages[0]}
            alt="Главное изображение номера"
            fallbackSrc="/images/room-placeholder.jpg"
            height="100%"
            responsiveSources={optimizedImages[0]}
          />
        </MainImageContainer>
        
        {/* Миниатюры других изображений */}
        {formattedImages.slice(1, maxThumbnails + 1).map((image, index) => (
          <ThumbnailContainer key={index} onClick={() => openLightbox(index + 1)}>
            <ImageWithFallback
              src={image}
              alt={`Изображение номера ${index + 1}`}
              fallbackSrc="/images/room-placeholder.jpg"
              height="100%"
              responsiveSources={optimizedImages[index + 1]}
            />
          </ThumbnailContainer>
        ))}
        
        {/* Если изображений больше 5, показываем оверлей с количеством оставшихся */}
        {formattedImages.length > 5 && (
          <ThumbnailContainer onClick={() => openLightbox(4)} style={{ position: 'relative' }}>
            <ImageWithFallback
              src={formattedImages[4]}
              alt="Больше изображений"
              fallbackSrc="/images/room-placeholder.jpg"
              height="100%"
              responsiveSources={optimizedImages[4]}
            />
            <MoreImagesOverlay>
              +{formattedImages.length - 5}
            </MoreImagesOverlay>
          </ThumbnailContainer>
        )}
      </Gallery>
      
      {/* Лайтбокс для просмотра изображений */}
      <LightboxOverlay isOpen={lightboxOpen} onClick={closeLightbox}>
        <LightboxContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeLightbox}>
            <i className="fas fa-times"></i>
          </CloseButton>
          
          <LightboxImageContainer>
            <LightboxImage 
              src={formattedImages[currentImage]} 
              alt={`Изображение номера ${currentImage + 1}`} 
            />
          </LightboxImageContainer>
          
          <LightboxControls>
            <LightboxButton onClick={prevImage} disabled={formattedImages.length <= 1}>
              <i className="fas fa-chevron-left"></i>
            </LightboxButton>
            
            <div>{currentImage + 1} / {formattedImages.length}</div>
            
            <LightboxButton onClick={nextImage} disabled={formattedImages.length <= 1}>
              <i className="fas fa-chevron-right"></i>
            </LightboxButton>
          </LightboxControls>
          
          {formattedImages.length > 1 && (
            <ThumbnailsContainer>
              {formattedImages.map((image, index) => (
                <Thumbnail 
                  key={index}
                  src={image}
                  alt={`Миниатюра ${index + 1}`}
                  isActive={currentImage === index}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </ThumbnailsContainer>
          )}
        </LightboxContent>
      </LightboxOverlay>
    </>
  );
};

RoomGallery.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]).isRequired,
  apiUrl: PropTypes.string,
  optimizedImages: PropTypes.array
};

export default RoomGallery; 