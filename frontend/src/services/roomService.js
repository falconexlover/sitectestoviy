import api from './api';
import logger from '../utils/logger';

/**
 * Сервис для работы с номерами
 */
const roomService = {
  /**
   * Получить все номера
   * @returns {Promise} Результат запроса
   */
  getRooms: async () => {
    try {
      logger.debug('Загрузка списка номеров');
      const response = await api.get('/rooms');
      logger.debug('Получены номера:', response.data.length);
      return response;
    } catch (error) {
      logger.error('Ошибка при загрузке номеров:', error);
      throw error;
    }
  },

  /**
   * Получить номер по ID
   * @param {string} id - ID номера
   * @returns {Promise} Результат запроса
   */
  getRoomById: async id => {
    try {
      logger.debug(`Загрузка информации о номере с ID: ${id}`);
      const response = await api.get(`/rooms/${id}`);
      logger.debug('Получена информация о номере:', response.data.name);
      return response;
    } catch (error) {
      logger.error(`Ошибка при загрузке номера с ID: ${id}`, error);
      throw error;
    }
  },

  /**
   * Получить доступные номера на указанные даты
   * @param {Object} params - Параметры поиска
   * @returns {Promise} Результат запроса
   */
  getAvailableRooms: async params => {
    try {
      logger.debug('Поиск доступных номеров с параметрами:', params);
      const response = await api.get('/rooms/available', { params });
      logger.debug('Получены доступные номера:', response.data.length);
      return response;
    } catch (error) {
      logger.error('Ошибка при поиске доступных номеров:', error);
      throw error;
    }
  },

  /**
   * Создать новый номер (только для админа)
   * @param {Object} roomData - Данные номера
   * @returns {Promise} Результат запроса
   */
  createRoom: async roomData => {
    try {
      logger.debug('Создание нового номера:', roomData.name);
      const response = await api.post('/rooms', roomData);
      logger.info('Номер успешно создан:', response.data.name);
      return response;
    } catch (error) {
      logger.error('Ошибка при создании номера:', error);
      throw error;
    }
  },

  /**
   * Обновить номер (только для админа)
   * @param {string} id - ID номера
   * @param {Object} roomData - Данные для обновления
   * @returns {Promise} Результат запроса
   */
  updateRoom: async (id, roomData) => {
    try {
      logger.debug(`Обновление номера с ID: ${id}`);
      const response = await api.put(`/rooms/${id}`, roomData);
      logger.info('Номер успешно обновлен:', response.data.name);
      return response;
    } catch (error) {
      logger.error(`Ошибка при обновлении номера с ID: ${id}`, error);
      throw error;
    }
  },

  /**
   * Удалить номер (только для админа)
   * @param {string} id - ID номера
   * @returns {Promise} Результат запроса
   */
  deleteRoom: async id => {
    try {
      logger.debug(`Удаление номера с ID: ${id}`);
      const response = await api.delete(`/rooms/${id}`);
      logger.info('Номер успешно удален');
      return response;
    } catch (error) {
      logger.error(`Ошибка при удалении номера с ID: ${id}`, error);
      throw error;
    }
  },

  // Получение отзывов для номера
  getRoomReviews: id => api.get(`/rooms/${id}/reviews`),

  // Добавление отзыва к номеру
  addRoomReview: (id, reviewData) => api.post(`/rooms/${id}/reviews`, reviewData),

  // Получение типов номеров
  getRoomTypes: () => api.get('/room-types'),

  // Поиск номеров по параметрам
  searchRooms: params => api.get('/rooms/search', { params }),
};

export default roomService;
