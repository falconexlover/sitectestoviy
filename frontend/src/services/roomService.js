import api from './api';

const roomService = {
  // Получение всех номеров
  getAllRooms: () => api.get('/rooms'),
  
  // Получение номера по ID
  getRoomById: (id) => api.get(`/rooms/${id}`),
  
  // Создание нового номера (для администратора)
  createRoom: (roomData) => api.post('/rooms', roomData),
  
  // Обновление существующего номера (для администратора)
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  
  // Удаление номера (для администратора)
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  
  // Получение отзывов для номера
  getRoomReviews: (id) => api.get(`/rooms/${id}/reviews`),
  
  // Добавление отзыва к номеру
  addRoomReview: (id, reviewData) => api.post(`/rooms/${id}/reviews`, reviewData),
  
  // Получение типов номеров
  getRoomTypes: () => api.get('/room-types'),
  
  // Поиск номеров по параметрам
  searchRooms: (params) => api.get('/rooms/search', { params }),
};

export default roomService; 