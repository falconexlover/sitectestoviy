import BaseService from './baseService';
import { Booking, BookingData, BookingStatus } from '../types/services';
import { AxiosResponse } from 'axios';

/**
 * Сервис для работы с бронированиями
 */
class BookingService extends BaseService {
  constructor() {
    super('/bookings', 'бронирование');
  }

  /**
   * Создать новое бронирование
   * @param bookingData - Данные бронирования
   * @returns Результат запроса
   */
  createBooking(bookingData: BookingData): Promise<AxiosResponse<{ booking: Booking }>> {
    return this.post<{ booking: Booking }>('', bookingData, 'Создание нового бронирования');
  }

  /**
   * Получить все бронирования пользователя
   * @returns Результат запроса
   */
  getUserBookings(): Promise<AxiosResponse<{ bookings: Booking[] }>> {
    return this.get<{ bookings: Booking[] }>('', {}, 'Получение бронирований пользователя');
  }

  /**
   * Получить бронирование по ID
   * @param id - ID бронирования
   * @returns Результат запроса
   */
  getBookingById(id: string): Promise<AxiosResponse<{ booking: Booking }>> {
    return this.get<{ booking: Booking }>(`/${id}`, {}, `Получение бронирования с ID: ${id}`);
  }

  /**
   * Отменить бронирование
   * @param id - ID бронирования
   * @returns Результат запроса
   */
  cancelBooking(id: string): Promise<AxiosResponse<{ booking: Booking }>> {
    return this.put<{ booking: Booking }>(`/${id}/cancel`, {}, `Отмена бронирования с ID: ${id}`);
  }

  /**
   * Получить все бронирования (только для админа)
   * @returns Результат запроса
   */
  getAllBookings(): Promise<AxiosResponse<{ bookings: Booking[] }>> {
    return this.get<{ bookings: Booking[] }>('/admin/all', {}, 'Получение всех бронирований');
  }

  /**
   * Обновить статус бронирования (только для админа)
   * @param id - ID бронирования
   * @param status - Новый статус бронирования
   * @returns Результат запроса
   */
  updateBookingStatus(id: string, status: BookingStatus): Promise<AxiosResponse<{ booking: Booking }>> {
    return this.put<{ booking: Booking }>(`/admin/status/${id}`, { status }, `Обновление статуса бронирования ${id} на ${status}`);
  }

  /**
   * Проверка доступности номера
   * @param roomId - ID номера
   * @param checkIn - Дата заезда
   * @param checkOut - Дата выезда
   * @returns Результат запроса
   */
  checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<AxiosResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/availability', { roomId, checkIn, checkOut }, 
      `Проверка доступности номера ${roomId} на даты ${checkIn} - ${checkOut}`);
  }

  /**
   * Получение статистики по бронированиям (для администратора)
   * @returns Результат запроса
   */
  getBookingStats(): Promise<AxiosResponse<{ stats: Record<string, any> }>> {
    return this.get<{ stats: Record<string, any> }>('/stats', {}, 'Получение статистики по бронированиям');
  }
}

export default new BookingService(); 