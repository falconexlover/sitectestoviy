import axios from 'axios';

// Создаем экземпляр axios с базовым URL API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://lesnoy-dvorik-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена авторизации к запросам
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Если ошибка 401 (Unauthorized) и запрос еще не повторялся
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пробуем обновить токен
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || 'https://lesnoy-dvorik-backend.vercel.app/api'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // Если получили новый токен, сохраняем его и повторяем запрос
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          
          // Обновляем заголовок в текущем запросе
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          
          // Повторяем оригинальный запрос с новым токеном
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Если это произошло на странице, где требуется авторизация, 
        // перенаправляем на страницу входа
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
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

// Сервис для работы с пользователями
const userService = {
  updateProfile: (userData) => api.put('/auth/profile', userData),
  updatePassword: (passwords) => api.put('/auth/change-password', passwords),
  getProfile: () => api.get('/auth/profile')
};

export default api;
export {
  authService,
  roomService,
  bookingService,
  customerService,
  analyticsService,
  userService
}; 