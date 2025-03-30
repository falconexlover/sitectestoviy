import BaseService from './baseService';
import { AnalyticsData, OccupancyForecast, PopularRooms } from '../types/services';
import { AxiosResponse } from 'axios';

/**
 * Сервис для работы с аналитикой
 */
class AnalyticsService extends BaseService {
  constructor() {
    super('/analytics', 'аналитика');
  }

  /**
   * Получение общей статистики
   * @returns Результат запроса
   */
  getOverallStats(): Promise<AxiosResponse<{ stats: AnalyticsData }>> {
    return this.get<{ stats: AnalyticsData }>('/overall', {}, 'Получение общей статистики');
  }

  /**
   * Получение статистики за период
   * @param startDate - Начальная дата
   * @param endDate - Конечная дата
   * @returns Результат запроса
   */
  getStatsByPeriod(startDate: string, endDate: string): Promise<AxiosResponse<{ stats: AnalyticsData }>> {
    return this.get<{ stats: AnalyticsData }>('/period', { startDate, endDate }, 'Получение статистики за период');
  }

  /**
   * Получение прогноза заполняемости
   * @param days - Количество дней для прогноза
   * @returns Результат запроса
   */
  getOccupancyForecast(days: number = 30): Promise<AxiosResponse<{ forecast: OccupancyForecast }>> {
    return this.get<{ forecast: OccupancyForecast }>('/forecast', { days }, 'Получение прогноза заполняемости');
  }

  /**
   * Получение списка популярных номеров
   * @param limit - Ограничение количества результатов
   * @returns Результат запроса
   */
  getPopularRooms(limit: number = 5): Promise<AxiosResponse<{ rooms: PopularRooms[] }>> {
    return this.get<{ rooms: PopularRooms[] }>('/popular-rooms', { limit }, 'Получение списка популярных номеров');
  }

  /**
   * Получение статистики по типам номеров
   * @returns Результат запроса
   */
  getRoomTypeStats(): Promise<AxiosResponse<{ stats: Record<string, any> }>> {
    return this.get<{ stats: Record<string, any> }>('/room-types', {}, 'Получение статистики по типам номеров');
  }

  /**
   * Получение статистики по источникам бронирований
   * @returns Результат запроса
   */
  getBookingSourceStats(): Promise<AxiosResponse<{ stats: Record<string, any> }>> {
    return this.get<{ stats: Record<string, any> }>('/booking-sources', {}, 'Получение статистики по источникам бронирований');
  }
}

export default new AnalyticsService(); 