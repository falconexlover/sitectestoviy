import api from './api';

const userService = {
  // Авторизация и регистрация
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  
  logout: async () => {
    return await api.post('/auth/logout');
  },
  
  refreshToken: async () => {
    return await api.post('/auth/refresh-token');
  },
  
  // Работа с профилем
  getCurrentUser: async () => {
    return await api.get('/users/me');
  },
  
  updateUserProfile: async (userData) => {
    return await api.put('/users/me', userData);
  },
  
  changePassword: async (passwordData) => {
    return await api.post('/users/change-password', passwordData);
  },
  
  uploadAvatar: async (formData) => {
    return await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Управление пользователями (для админов)
  getAllUsers: async () => {
    return await api.get('/admin/users');
  },
  
  getAllCustomers: async () => {
    return await api.get('/admin/users?role=customer');
  },
  
  getUserById: async (userId) => {
    return await api.get(`/admin/users/${userId}`);
  },
  
  updateUser: async (userId, userData) => {
    return await api.put(`/admin/users/${userId}`, userData);
  },
  
  deleteUser: async (userId) => {
    return await api.delete(`/admin/users/${userId}`);
  },
  
  getUserBookings: async (userId) => {
    return await api.get(`/admin/users/${userId}/bookings`);
  },
  
  createUser: async (userData) => {
    return await api.post('/admin/users', userData);
  },
  
  getUserStats: async () => {
    return await api.get('/admin/users/stats');
  },
  
  // Сброс пароля
  requestPasswordReset: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (token, password) => {
    return await api.post('/auth/reset-password', { token, password });
  }
};

export default userService; 