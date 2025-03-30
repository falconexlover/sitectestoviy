import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import useTestimonials, { TestimonialType } from '../hooks/useTestimonials';
import Card from './common/Card';

interface TestimonialsProps {
  testimonials?: TestimonialType[];
}

// Стили компонентов
const TestimonialsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
  position: relative;
`;

const TestimonialSlider = styled.div`
  overflow: hidden;
  padding: 2rem 0;
`;

const TestimonialSliderInner = styled.div<{ activeIndex: number }>`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(${props => -props.activeIndex * 100}%);
`;

const TestimonialItem = styled.div`
  flex: 0 0 100%;
  padding: 0 2rem;
`;

const TestimonialCardContent = styled.div`
  text-align: center;
  position: relative;
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 1;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
`;

const AuthorImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.8rem;
  border: 3px solid var(--primary-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorName = styled.h4`
  font-size: 1.1rem;
  color: var(--dark-color);
  margin-bottom: 0.3rem;
`;

const RatingStars = styled.div`
  margin-bottom: 0.5rem;
  color: #ffc107;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const NavButton = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.active ? 'var(--primary-color)' : '#ddd')};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => (props.active ? 'var(--primary-color)' : '#bbb')};
  }
`;

const ArrowButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.direction === 'prev' ? 'left: 0;' : 'right: 0;')}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #eee;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const { 
    activeIndex, 
    items, 
    nextSlide, 
    prevSlide, 
    goToSlide, 
    renderStars 
  } = useTestimonials(testimonials);

  return (
    <TestimonialsContainer>
      <ArrowButton direction="prev" onClick={prevSlide}>
        &#8249;
      </ArrowButton>

      <TestimonialSlider>
        <TestimonialSliderInner activeIndex={activeIndex}>
          {items.map((testimonial, idx) => (
            <TestimonialItem key={testimonial.id}>
              <Card 
                elevation={2}
                animation="fadeIn" 
                animationDelay={idx * 100}
              >
                <TestimonialCardContent>
                  <QuoteIcon>
                    <FontAwesomeIcon icon={faQuoteLeft} />
                  </QuoteIcon>
                  <TestimonialText>{testimonial.text}</TestimonialText>
                  <RatingStars>
                    {renderStars(testimonial.rating).map(star => (
                      <FontAwesomeIcon 
                        key={star.key} 
                        icon={faStar} 
                        style={{ color: star.filled ? '#ffc107' : '#e4e5e9' }} 
                      />
                    ))}
                  </RatingStars>
                  <TestimonialAuthor>
                    <AuthorImage>
                      <img src={testimonial.avatar} alt={testimonial.author} />
                    </AuthorImage>
                    <AuthorName>{testimonial.author}</AuthorName>
                  </TestimonialAuthor>
                </TestimonialCardContent>
              </Card>
            </TestimonialItem>
          ))}
        </TestimonialSliderInner>
      </TestimonialSlider>

      <ArrowButton direction="next" onClick={nextSlide}>
        &#8250;
      </ArrowButton>

      <NavButtons>
        {items.map((_, index) => (
          <NavButton
            key={index}
            active={activeIndex === index}
            onClick={() => goToSlide(index)}
          />
        ))}
      </NavButtons>
    </TestimonialsContainer>
  );
};

// Оборачиваем компонент в React.memo для оптимизации
export default React.memo(Testimonials); 