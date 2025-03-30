import BaseService from './baseService';
import api from './api';
import { User } from '../types/services';
import { AxiosResponse } from 'axios';

/**
 * Сервис для работы с пользователями
 */
class UserService extends BaseService {
  constructor() {
    super('/auth', 'пользователь');
  }

  // Авторизация и регистрация
  /**
   * Авторизация пользователя
   * @param credentials - Данные для входа
   * @returns Результат запроса
   */
  login(credentials: { email: string; password: string }): Promise<AxiosResponse<{ token: string; user: User }>> {
    return this.post<{ token: string; user: User }>('/login', credentials, 'Вход пользователя в систему');
  }

  /**
   * Регистрация нового пользователя
   * @param userData - Данные пользователя
   * @returns Результат запроса
   */
  register(userData: Partial<User>): Promise<AxiosResponse<{ token: string; user: User }>> {
    return this.post<{ token: string; user: User }>('/register', userData, 'Регистрация нового пользователя');
  }

  /**
   * Выход пользователя
   * @returns Результат запроса
   */
  logout(): Promise<AxiosResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>('/logout', {}, 'Выход пользователя из системы');
  }

  /**
   * Обновление токена
   * @returns Результат запроса
   */
  refreshToken(): Promise<AxiosResponse<{ token: string }>> {
    return this.post<{ token: string }>('/refresh-token', {}, 'Обновление токена доступа');
  }

  // Работа с профилем
  /**
   * Получение данных текущего пользователя
   * @returns Результат запроса
   */
  getCurrentUser(): Promise<AxiosResponse<{ user: User }>> {
    return this.get<{ user: User }>('/profile', {}, 'Получение данных текущего пользователя');
  }

  /**
   * Обновление профиля пользователя
   * @param userData - Данные для обновления
   * @returns Результат запроса
   */
  updateUserProfile(userData: Partial<User>): Promise<AxiosResponse<{ user: User }>> {
    return this.put<{ user: User }>('/profile', userData, 'Обновление профиля пользователя');
  }

  /**
   * Изменение пароля
   * @param passwordData - Данные пароля
   * @returns Результат запроса
   */
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>('/change-password', passwordData, 'Изменение пароля пользователя');
  }

  /**
   * Загрузка аватара пользователя
   * @param formData - Данные формы с файлом
   * @returns Результат запроса
   */
  uploadAvatar(formData: FormData): Promise<AxiosResponse<{ user: User }>> {
    // Для мультиформата используем напрямую api
    return api.post<{ user: User }>('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Запрос на сброс пароля
   * @param email - Email пользователя
   * @returns Результат запроса
   */
  requestPasswordReset(email: string): Promise<AxiosResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>('/forgot-password', { email }, 'Запрос на сброс пароля');
  }

  /**
   * Сброс пароля
   * @param token - Токен сброса
   * @param password - Новый пароль
   * @returns Результат запроса
   */
  resetPassword(token: string, password: string): Promise<AxiosResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>('/reset-password', { token, password }, 'Сброс пароля');
  }
}

/**
 * Сервис для работы с администрированием пользователей
 */
class AdminUserService extends BaseService {
  constructor() {
    super('/admin/users', 'администрирование пользователей');
  }

  /**
   * Получение всех пользователей (для админов)
   * @returns Результат запроса
   */
  getAllUsers(): Promise<AxiosResponse<{ users: User[] }>> {
    return this.get<{ users: User[] }>();
  }

  /**
   * Получение всех клиентов (для админов)
   * @returns Результат запроса
   */
  getAllCustomers(): Promise<AxiosResponse<{ users: User[] }>> {
    return this.get<{ users: User[] }>('', { role: 'customer' });
  }

  /**
   * Получение пользователя по ID (для админов)
   * @param userId - ID пользователя
   * @returns Результат запроса
   */
  getUserById(userId: string): Promise<AxiosResponse<{ user: User }>> {
    return this.get<{ user: User }>(`/${userId}`);
  }

  /**
   * Обновление пользователя (для админов)
   * @param userId - ID пользователя
   * @param userData - Данные для обновления
   * @returns Результат запроса
   */
  updateUser(userId: string, userData: Partial<User>): Promise<AxiosResponse<{ user: User }>> {
    return this.put<{ user: User }>(`/${userId}`, userData);
  }

  /**
   * Удаление пользователя (для админов)
   * @param userId - ID пользователя
   * @returns Результат запроса
   */
  deleteUser(userId: string): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${userId}`);
  }

  /**
   * Получение бронирований пользователя (для админов)
   * @param userId - ID пользователя
   * @returns Результат запроса
   */
  getUserBookings(userId: string): Promise<AxiosResponse<{ bookings: any[] }>> {
    return this.get<{ bookings: any[] }>(`/${userId}/bookings`);
  }

  /**
   * Создание нового пользователя (для админов)
   * @param userData - Данные пользователя
   * @returns Результат запроса
   */
  createUser(userData: Partial<User>): Promise<AxiosResponse<{ user: User }>> {
    return this.post<{ user: User }>('', userData);
  }

  /**
   * Получение статистики по пользователям (для админов)
   * @returns Результат запроса
   */
  getUserStats(): Promise<AxiosResponse<{ stats: Record<string, any> }>> {
    return this.get<{ stats: Record<string, any> }>('/stats');
  }
}

const userService = new UserService();
const adminUserService = new AdminUserService();

export { adminUserService };
export default userService; 