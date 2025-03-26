import axios from 'axios';
import logger from '../utils/logger';

// Показываем текущий API URL
logger.debug(
  'Инициализация API с URL:',
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
);

// Создаем экземпляр axios с базовым URL API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Устанавливаем таймаут для запросов
});

// Функция для логирования запросов
const logRequest = config => {
  const { method, url, data, params } = config;
  logger.trace(`→ ${method.toUpperCase()} ${url}`, {
    headers: config.headers,
    data: data || {},
    params: params || {},
    timestamp: new Date().toISOString(),
  });
  // Сохраняем время начала запроса для вычисления длительности
  config._startTime = Date.now();
  return config;
};

// Функция для логирования ответов
const logResponse = response => {
  const { config, status, data } = response;
  const duration = Date.now() - (config._startTime || Date.now());
  logger.http(config.method.toUpperCase(), config.url, status, duration);
  logger.trace(`← ${config.method.toUpperCase()} ${config.url} ${status}`, {
    headers: response.headers,
    data: data,
    duration,
    timestamp: new Date().toISOString(),
  });
  return response;
};

// Интерцептор для добавления токена авторизации к запросам
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Добавляем временную метку для предотвращения кеширования
    if (config.method === 'get') {
      config.params = config.params || {};
      config.params['_t'] = Date.now();
    }

    // Логируем запрос
    return logRequest(config);
  },
  error => {
    logger.error('Ошибка при подготовке запроса:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  response => {
    // Логируем успешный ответ
    return logResponse(response);
  },
  async error => {
    const originalRequest = error.config;

    // Если сервер недоступен
    if (!error.response) {
      logger.error('Сервер недоступен:', {
        url: originalRequest.url,
        method: originalRequest.method,
        timestamp: new Date().toISOString(),
        message: error.message,
      });
      return Promise.reject(
        new Error('Сервер недоступен. Пожалуйста, проверьте соединение с интернетом.')
      );
    }

    // Логируем ошибку ответа
    const duration = Date.now() - (originalRequest._startTime || Date.now());
    logger.http(
      originalRequest.method.toUpperCase(),
      originalRequest.url,
      error.response?.status || 0,
      duration
    );

    logger.error(`← ${originalRequest.method.toUpperCase()} ${originalRequest.url} ОШИБКА`, {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      duration,
      timestamp: new Date().toISOString(),
    });

    // Если ошибка 401 (Unauthorized) и запрос еще не повторялся
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      logger.debug('Попытка обновления токена');

      try {
        // Пробуем обновить токен
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Если получили новый токен, сохраняем его и повторяем запрос
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          logger.debug('Токен успешно обновлен');

          // Обновляем заголовок в текущем запросе
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

          // Повторяем оригинальный запрос с новым токеном
          logger.debug('Повторение исходного запроса с новым токеном');
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        logger.error('Ошибка при обновлении токена:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Если это произошло на странице, где требуется авторизация,
        // перенаправляем на страницу входа
        if (window.location.pathname !== '/login') {
          logger.debug('Перенаправление на страницу входа из-за недействительного токена');
          window.location.href = '/login?session=expired';
        }

        return Promise.reject(refreshError);
      }
    }

    // Обработка определенных ошибок HTTP
    let errorMessage = '';
    switch (error.response.status) {
      case 400:
        errorMessage = 'Неверный запрос';
        break;
      case 403:
        errorMessage = 'Доступ запрещен';
        break;
      case 404:
        errorMessage = 'Ресурс не найден';
        break;
      case 500:
        errorMessage = 'Внутренняя ошибка сервера';
        break;
      default:
        errorMessage = error.response.data.message || 'Произошла ошибка';
        break;
    }

    error.message = errorMessage;

    // Добавляем детальную информацию об ошибке
    logger.debug(`Ошибка API: ${errorMessage}`, {
      status: error.response.status,
      url: originalRequest.url,
      method: originalRequest.method,
      responseData: error.response.data,
    });

    return Promise.reject(error);
  }
);

// Сервисы для работы с API
const authService = {
  register: userData => api.post('/auth/register', userData),
  login: credentials => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: userData => api.put('/auth/profile', userData),
  changePassword: passwords => api.put('/auth/change-password', passwords),
};

const roomService = {
  getRooms: () => api.get('/rooms'),
  getRoomById: id => api.get(`/rooms/${id}`),
  getAvailableRooms: params => api.get('/rooms/available', { params }),
  createRoom: roomData => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: id => api.delete(`/rooms/${id}`),
};

const bookingService = {
  createBooking: bookingData => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings'),
  getBookingById: id => api.get(`/bookings/${id}`),
  cancelBooking: id => api.put(`/bookings/cancel/${id}`),
  getAllBookings: () => api.get('/bookings/admin/all'),
  updateBookingStatus: (id, status) => api.put(`/bookings/admin/status/${id}`, { status }),
};

const customerService = {
  getAllCustomers: () => api.get('/customers'),
  searchCustomers: query => api.get('/customers/search', { params: { query } }),
  getCustomerById: id => api.get(`/customers/${id}`),
  getCustomerStats: id => api.get(`/customers/${id}/stats`),
};

const analyticsService = {
  getOverallStats: () => api.get('/analytics/overall'),
  getStatsByPeriod: (startDate, endDate) =>
    api.get('/analytics/period', {
      params: { startDate, endDate },
    }),
  getOccupancyForecast: days =>
    api.get('/analytics/forecast', {
      params: { days },
    }),
  getPopularRooms: limit =>
    api.get('/analytics/popular-rooms', {
      params: { limit },
    }),
};

// Сервис для работы с пользователями
const userService = {
  updateProfile: userData => api.put('/auth/profile', userData),
  updatePassword: passwords => api.put('/auth/change-password', passwords),
  getProfile: () => api.get('/auth/profile'),
};

export default api;
export { authService, roomService, bookingService, customerService, analyticsService, userService };
