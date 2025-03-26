import api from './api';

const analyticsService = {
  // Получение общей статистики
  getOverallStats: () => api.get('/analytics/overall'),

  // Получение статистики за период
  getStatsByPeriod: (startDate, endDate) =>
    api.get('/analytics/period', {
      params: { startDate, endDate },
    }),

  // Получение прогноза заполняемости
  getOccupancyForecast: () => api.get('/analytics/forecast'),

  // Получение списка популярных номеров
  getPopularRooms: () => api.get('/analytics/popular-rooms'),

  // Получение статистики по типам номеров
  getRoomTypeStats: () => api.get('/analytics/room-types'),

  // Получение статистики по источникам бронирований
  getBookingSourceStats: () => api.get('/analytics/booking-sources'),
};

export default analyticsService;
