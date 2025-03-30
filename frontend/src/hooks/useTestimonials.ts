import { useState, useEffect } from 'react';

export interface TestimonialType {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: string;
  date?: string;
}

// Демо-данные отзывов для тестирования
const demoTestimonials: TestimonialType[] = [
  {
    id: '1',
    author: 'Анна Иванова',
    rating: 5,
    text: 'Прекрасное место для отдыха! Тихий и уютный отель с отличным сервисом. Персонал очень вежливый и отзывчивый. Обязательно вернемся снова!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: '2023-05-15'
  },
  {
    id: '2',
    author: 'Сергей Петров',
    rating: 4,
    text: 'Хорошее место для отдыха с семьей. Чистый воздух, красивая природа и комфортные номера. Единственный минус - завтрак мог бы быть разнообразнее.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2023-07-22'
  },
  {
    id: '3',
    author: 'Елена Смирнова',
    rating: 5,
    text: 'Отличное место! Уютные домики, прекрасный вид из окна, вкусная еда. Персонал всегда готов помочь. Очень рекомендую для спокойного отдыха.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: '2023-08-10'
  },
  {
    id: '4',
    author: 'Дмитрий Козлов',
    rating: 4.5,
    text: 'Замечательный отель с прекрасным соотношением цены и качества. Приятная атмосфера, чистые номера, дружелюбный персонал.',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    date: '2023-09-05'
  }
];

// Хук для управления отзывами
const useTestimonials = (customTestimonials?: TestimonialType[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<TestimonialType[]>([]);

  // Инициализация отзывов
  useEffect(() => {
    setItems(customTestimonials || demoTestimonials);
  }, [customTestimonials]);

  // Переход к следующему слайду
  const nextSlide = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % items.length);
  };

  // Переход к предыдущему слайду
  const prevSlide = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + items.length) % items.length);
  };

  // Переход к конкретному слайду
  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Автоматическое переключение слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  // Функция для отображения звезд рейтинга
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push({ key: `star-${i}`, filled: true });
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push({ key: `star-${i}`, filled: true, half: true });
      } else {
        stars.push({ key: `star-${i}`, filled: false });
      }
    }

    return stars;
  };

  return {
    activeIndex,
    items,
    nextSlide,
    prevSlide,
    goToSlide,
    renderStars
  };
};

export default useTestimonials; 