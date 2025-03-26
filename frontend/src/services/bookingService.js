import api from './api';
import logger from '../utils/logger';

/**
 * Сервис для работы с бронированиями
 */
const bookingService = {
  /**
   * Создать новое бронирование
   * @param {Object} bookingData - Данные бронирования
   * @returns {Promise} Результат запроса
   */
  createBooking: async bookingData => {
    try {
      logger.debug('Создание нового бронирования');
      const response = await api.post('/bookings', bookingData);
      logger.info('Бронирование успешно создано, ID:', response.data.id);
      return response;
    } catch (error) {
      logger.error('Ошибка при создании бронирования:', error);
      throw error;
    }
  },

  /**
   * Получить все бронирования пользователя
   * @returns {Promise} Результат запроса
   */
  getUserBookings: async () => {
    try {
      logger.debug('Получение бронирований пользователя');
      const response = await api.get('/bookings');
      logger.debug('Получены бронирования пользователя:', response.data.length);
      return response;
    } catch (error) {
      logger.error('Ошибка при получении бронирований пользователя:', error);
      throw error;
    }
  },

  /**
   * Получить бронирование по ID
   * @param {string} id - ID бронирования
   * @returns {Promise} Результат запроса
   */
  getBookingById: async id => {
    try {
      logger.debug(`Получение бронирования с ID: ${id}`);
      const response = await api.get(`/bookings/${id}`);
      logger.debug('Получено бронирование:', response.data.id);
      return response;
    } catch (error) {
      logger.error(`Ошибка при получении бронирования с ID: ${id}`, error);
      throw error;
    }
  },

  /**
   * Отменить бронирование
   * @param {string} id - ID бронирования
   * @returns {Promise} Результат запроса
   */
  cancelBooking: async id => {
    try {
      logger.debug(`Отмена бронирования с ID: ${id}`);
      const response = await api.put(`/bookings/cancel/${id}`);
      logger.info('Бронирование успешно отменено');
      return response;
    } catch (error) {
      logger.error(`Ошибка при отмене бронирования с ID: ${id}`, error);
      throw error;
    }
  },

  /**
   * Получить все бронирования (только для админа)
   * @returns {Promise} Результат запроса
   */
  getAllBookings: async () => {
    try {
      logger.debug('Получение всех бронирований');
      const response = await api.get('/bookings/admin/all');
      logger.debug('Получены все бронирования:', response.data.length);
      return response;
    } catch (error) {
      logger.error('Ошибка при получении всех бронирований:', error);
      throw error;
    }
  },

  /**
   * Обновить статус бронирования (только для админа)
   * @param {string} id - ID бронирования
   * @param {string} status - Новый статус бронирования
   * @returns {Promise} Результат запроса
   */
  updateBookingStatus: async (id, status) => {
    try {
      logger.debug(`Обновление статуса бронирования ${id} на ${status}`);
      const response = await api.put(`/bookings/admin/status/${id}`, { status });
      logger.info(`Статус бронирования успешно обновлен на ${status}`);
      return response;
    } catch (error) {
      logger.error(`Ошибка при обновлении статуса бронирования ${id}:`, error);
      throw error;
    }
  },

  // Проверка доступности номера
  checkAvailability: (roomId, checkIn, checkOut) =>
    api.get('/bookings/availability', {
      params: { roomId, checkIn, checkOut },
    }),

  // Получение статистики по бронированиям (для администратора)
  getBookingStats: () => api.get('/bookings/stats'),
};

export default bookingService;
