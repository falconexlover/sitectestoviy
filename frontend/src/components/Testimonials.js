import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TestimonialsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
  position: relative;
  
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
    opacity: 0.05;
    z-index: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
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

const TestimonialsContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding: 1rem 0;
`;

const TestimonialsTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(${props => props.offset}px);
`;

const TestimonialCard = styled.div`
  flex: 0 0 ${props => props.width}px;
  padding: 0 1rem;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${props => props.active ? 1 : 0.3};
  transform: scale(${props => props.active ? 1 : 0.9});
`;

const TestimonialInner = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '"';
    position: absolute;
    top: 0.5rem;
    left: 1rem;
    font-size: 5rem;
    font-family: 'Playfair Display', serif;
    color: var(--primary-color);
    opacity: 0.2;
    line-height: 1;
  }
`;

const TestimonialContent = styled.div`
  margin-bottom: 1.5rem;
  flex-grow: 1;
  
  p {
    color: var(--text-color);
    font-style: italic;
    line-height: 1.7;
    margin-bottom: 0;
    position: relative;
    z-index: 1;
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  h4 {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    color: var(--dark-color);
  }
  
  p {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  gap: 1rem;
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.disabled ? 'var(--light-color)' : 'white'};
  border: none;
  box-shadow: ${props => props.disabled ? 'none' : 'var(--shadow-md)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  i {
    color: ${props => props.disabled ? 'var(--border-color)' : 'var(--primary-color)'};
    font-size: 1.2rem;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
`;

const Indicators = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
`;

const Indicator = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-muted)'};
    transform: scale(1.2);
  }
`;

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  
  const testimonials = [
    {
      id: 1,
      content: 'Прекрасный отель с уютной атмосферой. Очень понравился интерьер номера и внимательный персонал. Расположение тоже отличное — рядом парк и набережная. Обязательно приедем сюда снова, уже с семьёй!',
      author: 'Анна Смирнова',
      position: 'Постоянный гость',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      content: 'Мы с женой провели здесь выходные, и остались в полном восторге! Отличный сервис, превосходная кухня и комфортные номера. Особенно хочется отметить чистоту и тишину - то, что нужно для спокойного отдыха от городской суеты.',
      author: 'Павел Иванов',
      position: 'Бизнес-путешественник',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      content: 'Отдыхали семьей с детьми. Для них здесь просто рай — детская площадка, анимация, удобный бассейн. Мы же наслаждались спокойствием и природой. Завтраки включены и очень вкусные. Обязательно вернёмся снова в этот уютный уголок!',
      author: 'Елена Козлова',
      position: 'Семейный отдых',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: 4,
      content: 'Проводил здесь конференцию для нашей компании. Всё на высшем уровне: конференц-зал с современным оборудованием, кофе-брейки, обеды. Коллеги остались довольны и условиями размещения. Рекомендую как для бизнеса, так и для отдыха.',
      author: 'Алексей Петров',
      position: 'Директор по развитию',
      image: 'https://randomuser.me/api/portraits/men/11.jpg'
    },
    {
      id: 5,
      content: 'Приезжали на романтический уикенд. Выбрали люкс с видом на лес — это было идеальное решение! Порадовал СПА-комплекс и ресторан с местной кухней. Спасибо персоналу за создание особой атмосферы и внимание к деталям.',
      author: 'Мария и Дмитрий',
      position: 'Молодожёны',
      image: 'https://randomuser.me/api/portraits/women/90.jpg'
    }
  ];
  
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev === testimonials.length - 1) ? 0 : prev + 1);
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0) ? testimonials.length - 1 : prev - 1);
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  return (
    <TestimonialsSection id="testimonials">
      <Container>
        <SectionHeader>
          <SectionTitle>Отзывы гостей</SectionTitle>
          <SectionSubtitle>
            Узнайте, что говорят о нас гости, которые уже побывали в нашем отеле
          </SectionSubtitle>
        </SectionHeader>
        
        <TestimonialsContainer ref={containerRef}>
          <TestimonialsTrack 
            ref={trackRef}
            offset={-currentSlide * slideWidth}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id}
                width={slideWidth}
                active={index === currentSlide}
              >
                <TestimonialInner>
                  <TestimonialContent>
                    <p>{testimonial.content}</p>
                  </TestimonialContent>
                  
                  <TestimonialAuthor>
                    <AuthorImage>
                      <img src={testimonial.image} alt={testimonial.author} />
                    </AuthorImage>
                    <AuthorInfo>
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.position}</p>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialInner>
              </TestimonialCard>
            ))}
          </TestimonialsTrack>
        </TestimonialsContainer>
        
        <NavigationButtons>
          <NavButton onClick={prevSlide}>
            <i className="fas fa-arrow-left"></i>
          </NavButton>
          <NavButton onClick={nextSlide}>
            <i className="fas fa-arrow-right"></i>
          </NavButton>
        </NavigationButtons>
        
        <Indicators>
          {testimonials.map((_, index) => (
            <Indicator 
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </Indicators>
      </Container>
    </TestimonialsSection>
  );
};

export default Testimonials; 