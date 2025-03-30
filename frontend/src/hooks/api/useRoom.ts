import { useCallback } from 'react';
import { useGet, usePost, usePut, useDelete, useApi } from './useApi';
import { Room } from '../../types/services';
import api from '../../services/api';

/**
 * Интерфейс для параметров поиска доступных номеров
 */
export interface RoomAvailabilityParams {
  startDate: string;
  endDate: string;
  capacity?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}

/**
 * Хук для получения всех номеров
 * @returns Объект с данными и методами для работы с номерами
 */
export function useRooms() {
  return useGet<Room[]>('/rooms');
}

/**
 * Хук для получения конкретного номера по ID
 * @param id ID номера
 * @returns Объект с данными и методами для работы с номером
 */
export function useRoomById(id: string | number) {
  return useGet<Room>(`/rooms/${id}`);
}

/**
 * Хук для получения доступных номеров по параметрам
 * @returns Объект с данными и методами для поиска доступных номеров
 */
export function useAvailableRooms() {
  const { state, execute, reset } = useApi<Room[], RoomAvailabilityParams>(
    useCallback((params?: RoomAvailabilityParams) => {
      return api.get<Room[]>('/rooms/available', { params });
    }, []),
    false
  );
  
  const searchRooms = useCallback((params: RoomAvailabilityParams) => {
    return execute(params);
  }, [execute]);
  
  return {
    rooms: state.data,
    loading: state.loading,
    error: state.error,
    searchRooms,
    reset
  };
}

/**
 * Хук для создания нового номера
 * @returns Объект с методами для создания номера
 */
export function useCreateRoom() {
  return usePost<Room, Partial<Room>>('/rooms');
}

/**
 * Хук для обновления номера
 * @param id ID номера для обновления
 * @returns Объект с методами для обновления номера
 */
export function useUpdateRoom(id: string | number) {
  return usePut<Room, Partial<Room>>(`/rooms/${id}`);
}

/**
 * Хук для удаления номера
 * @param id ID номера для удаления
 * @returns Объект с методами для удаления номера
 */
export function useDeleteRoom(id: string | number) {
  return useDelete<{ success: boolean }>(`/rooms/${id}`);
} 