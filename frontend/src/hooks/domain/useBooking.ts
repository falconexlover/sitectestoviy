import { useCallback } from 'react';
import { useGet, usePost, usePut, useApi } from '../api/useApi';
import api from '../../services/api';
import { Booking } from '../../types/booking';

/**
 * Интерфейс для данных создания нового бронирования
 */
export interface BookingCreateData {
  roomId: string | number;
  startDate: string;
  endDate: string;
  guests: number;
  specialRequests?: string;
  totalPrice: number;
}

/**
 * Интерфейс для изменения статуса бронирования
 */
export interface BookingStatusUpdate {
  status: Booking['status'];
}

/**
 * Интерфейс для параметров проверки доступности номера
 */
export interface AvailabilityCheckParams {
  roomId: string | number;
  startDate: string;
  endDate: string;
}

/**
 * Хук для получения всех бронирований пользователя
 * @returns Объект с бронированиями пользователя и методами
 */
export function useUserBookings() {
  return useGet<Booking[]>('/bookings');
}

/**
 * Хук для получения бронирования по ID
 * @param id ID бронирования
 * @returns Объект с данными бронирования и методами
 */
export function useBookingById(id: string | number) {
  return useGet<Booking>(`/bookings/${id}`);
}

/**
 * Хук для создания нового бронирования
 * @returns Объект с методами для создания бронирования
 */
export function useCreateBooking() {
  return usePost<Booking, BookingCreateData>('/bookings');
}

/**
 * Хук для отмены бронирования
 * @param id ID бронирования
 * @returns Объект с методами для отмены бронирования
 */
export function useCancelBooking(id: string | number) {
  return usePut<Booking, void>(`/bookings/cancel/${id}`);
}

/**
 * Хук для получения всех бронирований (для администратора)
 * @returns Объект с данными всех бронирований и методами
 */
export function useAllBookings() {
  return useGet<Booking[]>('/bookings/admin/all');
}

/**
 * Хук для обновления статуса бронирования (для администратора)
 * @param id ID бронирования
 * @returns Объект с методами для обновления статуса
 */
export function useUpdateBookingStatus(id: string | number) {
  return usePut<Booking, BookingStatusUpdate>(`/bookings/admin/status/${id}`);
}

/**
 * Хук для проверки доступности номера на указанные даты
 * @returns Объект с методом проверки доступности
 */
export function useCheckRoomAvailability() {
  const { state, execute, reset } = useApi<
    { available: boolean; conflicts: Booking[] }, 
    AvailabilityCheckParams
  >(
    useCallback((params?: AvailabilityCheckParams) => {
      if (!params) {
        throw new Error('Параметры проверки доступности номера обязательны');
      }
      return api.get<{ available: boolean; conflicts: Booking[] }>('/bookings/check-availability', { params });
    }, []),
    false
  );
  
  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    checkAvailability: execute,
    reset
  };
} 