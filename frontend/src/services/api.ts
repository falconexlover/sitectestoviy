import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { User, Room, RoomAvailabilityParams, RoomData, Booking, BookingData, BookingStatus, Customer, CustomerStats, AnalyticsData, OccupancyForecast, PopularRooms } from '../types/services';

// Кастомная конфигурация для Axios с _retry полем
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Создаем экземпляр axios с базовым URL API
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://lesnoy-dvorik-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации к запросам
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    
    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post<{ token: string }>(
          `${process.env.REACT_APP_API_URL || 'https://lesnoy-dvorik-backend.vercel.app/api'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Сервисы для работы с API
export const authService = {
  register: (userData: Partial<User>) => api.post<{ user: User; token: string }>('/auth/register', userData),
  login: (credentials: { email: string; password: string }) => 
    api.post<{ user: User; token: string }>('/auth/login', credentials),
  getProfile: () => api.get<{ user: User }>('/auth/profile'),
  updateProfile: (userData: Partial<User>) => api.put<{ user: User }>('/auth/profile', userData),
  changePassword: (passwords: { currentPassword: string; newPassword: string }) => api.put('/auth/change-password', passwords),
  logout: () => api.post('/auth/logout'),
  getAllUsers: () => api.get<{ users: User[] }>('/auth/users'),
  deleteUser: (userId: string) => api.delete(`/auth/users/${userId}`),
  updateUserRole: (userId: string, role: string) => api.put(`/auth/users/${userId}/role`, { role }),
};

export const roomService = {
  getRooms: () => api.get<{ rooms: Room[] }>('/rooms'),
  getAll: (params?: any) => api.get<{ rooms: Room[] }>('/rooms', { params }),
  getRoomById: (id: string) => api.get<{ room: Room }>(`/rooms/${id}`),
  getAvailableRooms: (params: RoomAvailabilityParams) => 
    api.get<{ rooms: Room[] }>('/rooms/available', { params }),
  createRoom: (roomData: RoomData) => api.post<{ room: Room }>('/rooms', roomData),
  updateRoom: (id: string, roomData: RoomData) => 
    api.put<{ room: Room }>(`/rooms/${id}`, roomData),
  deleteRoom: (id: string) => api.delete(`/rooms/${id}`),
};

export const bookingService = {
  createBooking: (bookingData: BookingData) => 
    api.post<{ booking: Booking }>('/bookings', bookingData),
  getUserBookings: () => api.get<{ bookings: Booking[] }>('/bookings'),
  getBookingById: (id: string) => api.get<{ booking: Booking }>(`/bookings/${id}`),
  cancelBooking: (id: string) => api.put<{ booking: Booking }>(`/bookings/${id}/cancel`),
  getAllBookings: () => api.get<{ bookings: Booking[] }>('/bookings/admin/all'),
  updateBookingStatus: (id: string, status: BookingStatus) => 
    api.put<{ booking: Booking }>(`/bookings/admin/status/${id}`, { status }),
  checkAvailability: (roomId: string, checkIn: string, checkOut: string) =>
    api.get<{ available: boolean }>('/bookings/availability', {
      params: { roomId, checkIn, checkOut },
    }),
  getBookingStats: () => api.get<{ stats: any }>('/bookings/stats'),
};

export const customerService = {
  getAllCustomers: () => api.get<{ customers: Customer[] }>('/customers'),
  searchCustomers: (query: string) => 
    api.get<{ customers: Customer[] }>('/customers/search', { params: { query } }),
  getCustomerById: (id: string) => api.get<{ customer: Customer }>(`/customers/${id}`),
  getCustomerStats: (id: string) => api.get<{ stats: CustomerStats }>(`/customers/${id}/stats`),
};

export const analyticsService = {
  getOverallStats: () => api.get<{ stats: AnalyticsData }>('/analytics/overall'),
  getStatsByPeriod: (startDate: string, endDate: string) =>
    api.get<{ stats: AnalyticsData }>('/analytics/period', {
      params: { startDate, endDate },
    }),
  getOccupancyForecast: (days: number) =>
    api.get<{ forecast: OccupancyForecast }>('/analytics/forecast', {
      params: { days },
    }),
  getPopularRooms: (limit: number) =>
    api.get<{ rooms: PopularRooms[] }>('/analytics/popular-rooms', {
      params: { limit },
    }),
};

export const userService = {
  updateProfile: (userData: Partial<User>) => api.put<{ user: User }>('/auth/profile', userData),
  updatePassword: (passwords: { currentPassword: string; newPassword: string }) => api.put('/auth/change-password', passwords),
  getProfile: () => api.get<{ user: User }>('/auth/profile'),
};

export default api; 