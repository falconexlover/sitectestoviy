import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import api from '../../services/api';

/**
 * Состояние API запроса
 */
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

/**
 * Интерфейс для возвращаемого объекта хука useApi
 */
export interface UseApiReturn<T, P = void> {
  state: ApiState<T>;
  execute: P extends void ? () => Promise<T | null> : (params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Базовый хук для выполнения API запросов с управлением состоянием
 * @param apiMethod Функция API запроса
 * @param immediate Выполнить запрос сразу при монтировании
 * @param initialParams Начальные параметры для запроса
 * @returns Объект с состоянием запроса и методами управления
 */
export function useApi<T, P = void>(
  apiMethod: (params?: P) => Promise<AxiosResponse<T>>,
  immediate: boolean = false,
  initialParams?: P
): UseApiReturn<T, P> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
    status: null
  });

  // Функция для сброса состояния
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      status: null
    });
  }, []);

  // Функция выполнения запроса
  const execute = useCallback(
    async (params?: P): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiMethod(params);
        
        setState({
          data: response.data,
          loading: false,
          error: null,
          status: response.status
        });
        
        return response.data;
      } catch (err) {
        const error = err as AxiosError<{message?: string}>;
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка при запросе';
        
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          status: error.response?.status || null
        });
        
        return null;
      }
    },
    [apiMethod]
  );

  // Выполняем запрос при монтировании, если нужно
  useEffect(() => {
    if (immediate) {
      execute(initialParams as P);
    }
  }, [immediate, execute, initialParams]);

  return {
    state,
    execute: execute as UseApiReturn<T, P>['execute'],
    reset
  };
}

/**
 * Хук для GET запросов
 * @param url URL эндпоинта
 * @param config Конфигурация запроса
 * @param immediate Выполнить запрос сразу
 * @returns Объект с состоянием запроса и методами управления
 */
export function useGet<T>(
  url: string, 
  config?: AxiosRequestConfig,
  immediate: boolean = true
): UseApiReturn<T> {
  return useApi<T>(
    useCallback(() => api.get<T>(url, config), [url, config]),
    immediate
  );
}

/**
 * Хук для POST запросов
 * @param url URL эндпоинта
 * @param config Дополнительная конфигурация
 * @returns Объект с состоянием запроса и методами управления
 */
export function usePost<T, D = any>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T, D> {
  return useApi<T, D>(
    useCallback((params?: D) => {
      if (params === undefined) {
        throw new Error('POST запрос требует данные');
      }
      return api.post<T>(url, params, config);
    }, [url, config]),
    false
  );
}

/**
 * Хук для PUT запросов
 * @param url URL эндпоинта
 * @param config Дополнительная конфигурация
 * @returns Объект с состоянием запроса и методами управления
 */
export function usePut<T, D = any>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T, D> {
  return useApi<T, D>(
    useCallback((params?: D) => {
      if (params === undefined) {
        throw new Error('PUT запрос требует данные');
      }
      return api.put<T>(url, params, config);
    }, [url, config]),
    false
  );
}

/**
 * Хук для DELETE запросов
 * @param url URL эндпоинта
 * @param config Дополнительная конфигурация
 * @returns Объект с состоянием запроса и методами управления
 */
export function useDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T> {
  return useApi<T>(
    useCallback(() => api.delete<T>(url, config), [url, config]),
    false
  );
} 