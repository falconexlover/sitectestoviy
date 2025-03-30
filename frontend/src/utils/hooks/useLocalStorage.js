import { useState, useEffect, useCallback } from 'react';
import logger from '../logger';

/**
 * Хук для работы с localStorage в React
 * 
 * @param {string} key - Ключ для хранения в localStorage
 * @param {any} initialValue - Начальное значение, если данные не найдены
 * @param {Object} options - Дополнительные опции
 * @param {boolean} options.sync - Синхронизировать значение между вкладками
 * @param {number} options.expiryMinutes - Время жизни данных в минутах
 * @param {Function} options.serialize - Функция для сериализации данных (по умолчанию JSON.stringify)
 * @param {Function} options.deserialize - Функция для десериализации данных (по умолчанию JSON.parse)
 * 
 * @returns {Array} [value, setValue, removeValue] - Массив с значением, функцией установки и удаления
 */
export const useLocalStorage = (
  key,
  initialValue,
  {
    sync = false,
    expiryMinutes = 0,
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = {}
) => {
  // Функция для получения начального значения из localStorage
  const getStoredValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // Если элемент не существует, вернуть начальное значение
      if (item === null) {
        return typeof initialValue === 'function' ? initialValue() : initialValue;
      }
      
      // Десериализуем сохраненное значение
      const parsedItem = deserialize(item);
      
      // Если задано время жизни, проверяем истекло ли оно
      if (expiryMinutes > 0 && parsedItem._expiry) {
        const now = new Date().getTime();
        if (now > parsedItem._expiry) {
          logger.debug(`Срок хранения '${key}' истек, используем начальное значение`);
          window.localStorage.removeItem(key);
          return typeof initialValue === 'function' ? initialValue() : initialValue;
        }
      }
      
      return parsedItem._value !== undefined ? parsedItem._value : parsedItem;
    } catch (error) {
      logger.error(`Ошибка при чтении из localStorage для ключа '${key}'`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  }, [key, initialValue, deserialize, expiryMinutes]);
  
  // Используем useState для хранения значения
  const [storedValue, setStoredValue] = useState(getStoredValue);
  
  // Функция для установки значения в localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // Разрешаем значение быть функцией как в useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
          
        // Сохраняем в состоянии
        setStoredValue(valueToStore);
        
        // Подготавливаем данные для хранения
        let storageItem = valueToStore;
        
        // Если задано время жизни, добавляем его
        if (expiryMinutes > 0) {
          const expiryTime = new Date().getTime() + expiryMinutes * 60 * 1000;
          storageItem = {
            _value: valueToStore,
            _expiry: expiryTime
          };
        }
        
        // Сохраняем в localStorage
        window.localStorage.setItem(key, serialize(storageItem));
        
        // Диспатчим событие для синхронизации между вкладками, если включено
        if (sync) {
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: serialize(storageItem),
              url: window.location.href
            })
          );
        }
      } catch (error) {
        logger.error(`Ошибка при записи в localStorage для ключа '${key}'`, error);
      }
    },
    [key, serialize, storedValue, expiryMinutes, sync]
  );
  
  // Функция для удаления значения из localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue);
      
      // Диспатчим событие для синхронизации между вкладками, если включено
      if (sync) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
            url: window.location.href
          })
        );
      }
    } catch (error) {
      logger.error(`Ошибка при удалении из localStorage для ключа '${key}'`, error);
    }
  }, [key, initialValue, sync]);
  
  // Обработчик изменений в localStorage из других вкладок
  useEffect(() => {
    if (!sync) return;
    
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          if (event.newValue === null) {
            setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue);
          } else {
            const newValue = deserialize(event.newValue);
            setStoredValue(newValue._value !== undefined ? newValue._value : newValue);
          }
        } catch (error) {
          logger.error(`Ошибка при синхронизации localStorage для ключа '${key}'`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, sync, deserialize]);
  
  return [storedValue, setValue, removeValue];
}; 