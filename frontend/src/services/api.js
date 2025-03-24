import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов для добавления токена
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    // Если ошибка авторизации (токен истек), разлогиниваем пользователя
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Сервисы для работы с API
const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords)
};

const roomService = {
  getRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  getAvailableRooms: (params) => api.get('/rooms/available', { params }),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`)
};

const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/cancel/${id}`),
  getAllBookings: () => api.get('/bookings/admin/all'),
  updateBookingStatus: (id, status) => api.put(`/bookings/admin/status/${id}`, { status })
};

const customerService = {
  getAllCustomers: () => api.get('/customers'),
  searchCustomers: (query) => api.get('/customers/search', { params: { query } }),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  getCustomerStats: (id) => api.get(`/customers/${id}/stats`)
};

const analyticsService = {
  getOverallStats: () => api.get('/analytics/overall'),
  getStatsByPeriod: (startDate, endDate) => api.get('/analytics/period', { 
    params: { startDate, endDate } 
  }),
  getOccupancyForecast: (days) => api.get('/analytics/forecast', { 
    params: { days } 
  }),
  getPopularRooms: (limit) => api.get('/analytics/popular-rooms', { 
    params: { limit } 
  })
};

export {
  api,
  authService,
  roomService,
  bookingService,
  customerService,
  analyticsService
}; 