import { useState, useEffect, useCallback } from 'react';
import logger from '../logger';

/**
 * Хук для выполнения API запросов с отслеживанием состояния
 * 
 * @param {Function} queryFn - Функция для выполнения запроса
 * @param {Object} options - Опции запроса
 * @param {boolean} options.enabled - Выполнять запрос автоматически
 * @param {Array} options.dependencies - Зависимости для повторного запроса
 * @param {Function} options.onSuccess - Функция обратного вызова при успехе
 * @param {Function} options.onError - Функция обратного вызова при ошибке
 * @param {String} options.queryName - Название запроса для логирования
 * 
 * @returns {Object} Объект с данными, состоянием и функциями управления запросом
 */
export const useQuery = (
  queryFn,
  {
    enabled = true,
    dependencies = [],
    onSuccess = () => {},
    onError = () => {},
    queryName = 'query'
  } = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  
  // Функция для выполнения запроса
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      logger.debug(`Запрос '${queryName}' начат`, { args });
      
      const result = await queryFn(...args);
      
      const endTime = performance.now();
      logger.debug(`Запрос '${queryName}' успешно завершен за ${Math.round(endTime - startTime)}ms`, { result });
      
      setData(result);
      setTimestamp(new Date());
      onSuccess(result);
      
      return result;
    } catch (err) {
      logger.error(`Ошибка в запросе '${queryName}'`, err);
      setError(err);
      onError(err);
      
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, [queryFn, queryName, onSuccess, onError]);
  
  // Автоматическое выполнение запроса при монтировании или изменении зависимостей
  useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled, execute, ...dependencies]);
  
  // Функция для сброса состояния запроса
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setTimestamp(null);
  }, []);
  
  // Функция для повторного выполнения запроса
  const refetch = useCallback((...args) => {
    return execute(...args);
  }, [execute]);
  
  return {
    data,
    loading,
    error,
    timestamp,
    execute,
    refetch,
    reset,
    isSuccess: !!data && !error,
    isError: !!error,
    isIdle: !loading && !data && !error,
  };
}; 