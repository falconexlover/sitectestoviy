import { useState, useEffect } from 'react';

/**
 * Хук для дебаунсинга значений
 * @param value Значение для дебаунсинга
 * @param delay Задержка в миллисекундах
 * @returns Дебаунсированное значение
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Создаем таймер для обновления дебаунсированного значения
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении value или delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 