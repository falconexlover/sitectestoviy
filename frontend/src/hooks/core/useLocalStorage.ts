import { useState, useEffect } from 'react';

/**
 * Хук для работы с localStorage с типизацией
 * @param key Ключ для сохранения в localStorage
 * @param initialValue Начальное значение
 * @returns [значение, функция установки значения]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Получаем сохраненное значение из localStorage или используем initialValue
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Ошибка чтения localStorage ключа "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Функция для обновления значения в state и localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Разрешаем value быть функцией как useState
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      
      // Сохраняем в state
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Событие для обновления других вкладок
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Ошибка сохранения в localStorage для ключа "${key}":`, error);
    }
  };

  // Синхронизация с другими вкладками
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // При изменении в других вкладках
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
} 