import api from './api';

const bookingService = {
  // Получение всех бронирований (для администратора)
  getAllBookings: () => api.get('/bookings/admin/all'),
  
  // Получение бронирований текущего пользователя
  getUserBookings: () => api.get('/bookings/user'),
  
  // Получение бронирования по ID
  getBookingById: (id) => api.get(`/bookings/${id}`),
  
  // Создание нового бронирования
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  
  // Отмена бронирования
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  
  // Обновление статуса бронирования (для администратора)
  updateBookingStatus: (id, status) => api.put(`/bookings/admin/status/${id}`, { status }),
  
  // Проверка доступности номера
  checkAvailability: (roomId, checkIn, checkOut) => api.get('/bookings/availability', {
    params: { roomId, checkIn, checkOut }
  }),
  
  // Получение статистики по бронированиям (для администратора)
  getBookingStats: () => api.get('/bookings/stats'),
};

export default bookingService; 