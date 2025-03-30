import BaseService from './baseService';
import { Room, RoomData, RoomAvailabilityParams } from '../types/services';
import { AxiosResponse } from 'axios';

/**
 * Сервис для работы с номерами
 */
class RoomService extends BaseService {
  constructor() {
    super('/rooms', 'номер');
  }

  /**
   * Получить все номера
   * @returns Результат запроса
   */
  getRooms(): Promise<AxiosResponse<{ rooms: Room[] }>> {
    return this.get<{ rooms: Room[] }>();
  }

  /**
   * Получить номер по ID
   * @param id - ID номера
   * @returns Результат запроса
   */
  getRoomById(id: string): Promise<AxiosResponse<{ room: Room }>> {
    return this.get<{ room: Room }>(`/${id}`, {}, `Загрузка информации о номере с ID: ${id}`);
  }

  /**
   * Получить доступные номера на указанные даты
   * @param params - Параметры поиска
   * @returns Результат запроса
   */
  getAvailableRooms(params: RoomAvailabilityParams): Promise<AxiosResponse<{ rooms: Room[] }>> {
    return this.get<{ rooms: Room[] }>('/available', params, 'Поиск доступных номеров с параметрами');
  }

  /**
   * Создать новый номер (только для админа)
   * @param roomData - Данные номера
   * @returns Результат запроса
   */
  createRoom(roomData: RoomData): Promise<AxiosResponse<{ room: Room }>> {
    return this.post<{ room: Room }>('', roomData, `Создание нового номера: ${roomData.name}`);
  }

  /**
   * Обновить номер (только для админа)
   * @param id - ID номера
   * @param roomData - Данные для обновления
   * @returns Результат запроса
   */
  updateRoom(id: string, roomData: Partial<RoomData>): Promise<AxiosResponse<{ room: Room }>> {
    return this.put<{ room: Room }>(`/${id}`, roomData, `Обновление номера с ID: ${id}`);
  }

  /**
   * Удалить номер (только для админа)
   * @param id - ID номера
   * @returns Результат запроса
   */
  deleteRoom(id: string): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`, `Удаление номера с ID: ${id}`);
  }

  /**
   * Получение отзывов для номера
   * @param id - ID номера
   * @returns Результат запроса
   */
  getRoomReviews(id: string): Promise<AxiosResponse<{ reviews: any[] }>> {
    return this.get<{ reviews: any[] }>(`/${id}/reviews`, {}, `Получение отзывов для номера с ID: ${id}`);
  }

  /**
   * Добавление отзыва к номеру
   * @param id - ID номера
   * @param reviewData - Данные отзыва
   * @returns Результат запроса
   */
  addRoomReview(id: string, reviewData: Record<string, any>): Promise<AxiosResponse<{ review: any }>> {
    return this.post<{ review: any }>(`/${id}/reviews`, reviewData, `Добавление отзыва к номеру с ID: ${id}`);
  }

  /**
   * Получение типов номеров
   * @returns Результат запроса
   */
  getRoomTypes(): Promise<AxiosResponse<{ types: string[] }>> {
    return this.get<{ types: string[] }>('/room-types', {}, 'Получение типов номеров');
  }

  /**
   * Поиск номеров по параметрам
   * @param params - Параметры поиска
   * @returns Результат запроса
   */
  searchRooms(params: Record<string, any>): Promise<AxiosResponse<{ rooms: Room[] }>> {
    return this.get<{ rooms: Room[] }>('/search', params, 'Поиск номеров по параметрам');
  }
}

export default new RoomService(); 