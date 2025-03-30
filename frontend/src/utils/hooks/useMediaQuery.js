import { useState, useEffect } from 'react';

/**
 * Хук для отслеживания медиа-запросов
 * 
 * @param {string} query - CSS медиа-запрос (например, '(max-width: 768px)')
 * @returns {boolean} Результат проверки медиа-запроса
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * return (
 *   <div>
 *     {isMobile ? 'Мобильная версия' : 'Десктопная версия'}
 *   </div>
 * );
 */
export const useMediaQuery = (query) => {
  // Проверяем, поддерживается ли matchMedia
  const supportsMatchMedia = typeof window !== 'undefined' && window.matchMedia;
  
  // Настраиваем начальное состояние
  const getMatches = () => {
    if (!supportsMatchMedia) {
      return false;
    }
    return window.matchMedia(query).matches;
  };
  
  const [matches, setMatches] = useState(getMatches);
  
  // Обработчик изменения медиа-запроса
  useEffect(() => {
    if (!supportsMatchMedia) {
      return undefined;
    }
    
    const mediaQueryList = window.matchMedia(query);
    
    // Функция для обновления состояния
    const updateMatches = (e) => {
      setMatches(e.matches);
    };
    
    // Добавляем обработчик
    if (mediaQueryList.addEventListener) {
      // Современные браузеры
      mediaQueryList.addEventListener('change', updateMatches);
    } else {
      // Старые браузеры (IE)
      mediaQueryList.addListener(updateMatches);
    }
    
    // Инициализируем состояние
    setMatches(mediaQueryList.matches);
    
    // Очистка
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', updateMatches);
      } else {
        mediaQueryList.removeListener(updateMatches);
      }
    };
  }, [query, supportsMatchMedia]);
  
  return matches;
};

/**
 * Предопределенные медиа-запросы для общих брейкпоинтов
 */
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Вспомогательные комбинации
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop
  };
}; 