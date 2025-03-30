import { useState, useEffect } from 'react';

/**
 * Хук для отслеживания медиа-запросов для адаптивного дизайна
 * @param query CSS медиа-запрос
 * @returns Результат медиа-запроса (true/false)
 */
export function useMediaQuery(query: string): boolean {
  // Создаём медиа-запрос
  const getMatches = (): boolean => {
    // Проверяем, что мы в браузере (не SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  // Обработчик изменения размера экрана
  const handleChange = () => {
    setMatches(getMatches());
  };

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Инициализируем значение
    handleChange();

    // Добавляем слушатель изменений
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    // Удаляем слушатель при размонтировании
    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Предопределённые медиа-запросы для популярных размеров экранов
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)'); 