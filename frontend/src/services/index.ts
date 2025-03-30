/**
 * Экспорт всех сервисов из одного файла
 * Это упрощает импорты в других частях приложения
 */
import api from './api';
import userService, { adminUserService } from './userService';
import roomService from './roomService';
import bookingService from './bookingService';
import analyticsService from './analyticsService';

export {
  api,
  userService,
  adminUserService,
  roomService,
  bookingService,
  analyticsService
};

/**
 * Можно импортировать все сервисы сразу:
 * import { userService, roomService, bookingService } from '../services';
 * 
 * Или отдельно:
 * import userService from '../services/userService';
 */ 