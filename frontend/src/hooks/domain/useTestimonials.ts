import { useState, useEffect, useCallback, useMemo } from 'react';

// Типы данных
export interface TestimonialType {
  id: number | string;
  text: string;
  author: string;
  rating: number;
  avatar: string;
}

interface StarProps {
  key: number;
  filled: boolean;
}

interface UseTestimonialsReturn {
  activeIndex: number;
  items: TestimonialType[];
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  renderStars: (rating: number) => StarProps[];
}

/**
 * Хук для управления отзывами клиентов
 */
export function useTestimonials(testimonials?: TestimonialType[]): UseTestimonialsReturn {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  // Дефолтные отзывы, если не переданы извне
  const defaultTestimonials: TestimonialType[] = useMemo(() => [
    {
      id: 1,
      text: 'Отличное место для отдыха в тихой лесной зоне. Очень понравилась атмосфера советской романтики. Обязательно вернёмся!',
      author: 'Анна П.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 2,
      text: 'Уютные номера, приветливый персонал. Сауна - отдельный бонус. Рекомендую для семейного отдыха.',
      author: 'Михаил К.',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      text: 'Провели конференцию в зале Лесного дворика. Всё на высшем уровне, спасибо за организацию!',
      author: 'Олег В., компания "Альфа"',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    },
  ], []);

  // Используем переданные отзывы или дефолтные
  const items = useMemo(() => testimonials || defaultTestimonials, [testimonials, defaultTestimonials]);

  // Методы навигации по слайдам
  const goToSlide = useCallback((index: number): void => {
    setActiveIndex(index);
  }, []);

  const nextSlide = useCallback((): void => {
    setActiveIndex(prevIndex => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback((): void => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  }, [items.length]);

  // Автоматическое переключение слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  // Функция для рендера звезд рейтинга
  const renderStars = useCallback((rating: number): StarProps[] => {
    return Array.from({ length: 5 }).map((_, i) => ({
      key: i,
      filled: i < rating
    }));
  }, []);

  return {
    activeIndex,
    items,
    nextSlide,
    prevSlide,
    goToSlide,
    renderStars
  };
}

export default useTestimonials; 