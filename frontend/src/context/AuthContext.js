import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import logger from '../utils/logger';

// Создаем контекст авторизации
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          logger.debug('Токен авторизации не найден в localStorage');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        logger.debug('Проверка авторизации с существующим токеном');

        // Получаем информацию о текущем пользователе
        const response = await authService.getProfile();

        if (response.status === 200) {
          logger.info('Пользователь успешно аутентифицирован');
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          // Если запрос не успешен, очищаем хранилище
          logger.warn('Получен некорректный ответ при проверке авторизации:', response.status);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        logger.error('Ошибка при проверке авторизации:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setError('Ошибка при проверке авторизации');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция для авторизации пользователя
  const login = async credentials => {
    try {
      setLoading(true);
      logger.debug('Попытка авторизации:', credentials.email);

      const response = await authService.login(credentials);

      const { token, user } = response.data;

      // Сохраняем токен в локальное хранилище
      localStorage.setItem('token', token);

      setUser(user);
      setIsAuthenticated(true);
      setError(null);

      logger.info('Пользователь успешно авторизован:', user.email);
      return { success: true };
    } catch (error) {
      logger.error('Ошибка при авторизации:', error);
      setError(
        error.response?.data?.message ||
          'Произошла ошибка при авторизации. Пожалуйста, проверьте ваши учетные данные.'
      );

      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка авторизации',
      };
    } finally {
      setLoading(false);
    }
  };

  // Функция для регистрации пользователя
  const register = async userData => {
    try {
      setLoading(true);
      logger.debug('Попытка регистрации нового пользователя:', userData.email);

      const response = await authService.register(userData);

      const { token, user } = response.data;

      // Сохраняем токен в локальное хранилище
      localStorage.setItem('token', token);

      setUser(user);
      setIsAuthenticated(true);
      setError(null);

      logger.info('Пользователь успешно зарегистрирован:', user.email);
      return { success: true };
    } catch (error) {
      logger.error('Ошибка при регистрации:', error);
      setError(
        error.response?.data?.message ||
          'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.'
      );

      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка регистрации',
      };
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = async () => {
    try {
      setLoading(true);
      logger.debug('Выход из системы');

      // Очищаем локальное хранилище
      localStorage.removeItem('token');

      setUser(null);
      setIsAuthenticated(false);

      logger.info('Пользователь успешно вышел из системы');
      return { success: true };
    } catch (error) {
      logger.error('Ошибка при выходе из системы:', error);
      // Даже при ошибке API мы все равно выходим локально
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);

      return { success: true }; // Всегда возвращаем успех для выхода
    } finally {
      setLoading(false);
    }
  };

  // Функция для обновления данных пользователя
  const updateProfile = async userData => {
    try {
      setLoading(true);
      logger.debug('Обновление данных пользователя');

      const response = await authService.updateProfile(userData);

      setUser(response.data);
      setError(null);

      logger.info('Профиль пользователя успешно обновлен');
      return { success: true };
    } catch (error) {
      logger.error('Ошибка при обновлении профиля:', error);
      setError(
        error.response?.data?.message ||
          'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте еще раз.'
      );

      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка обновления профиля',
      };
    } finally {
      setLoading(false);
    }
  };

  // Функция для проверки роли пользователя
  const hasRole = role => {
    return user && user.role === role;
  };

  // Передаем контекст и функции всем дочерним компонентам
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Для удобства использования контекста в компонентах
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
