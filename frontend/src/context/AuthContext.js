import React, { createContext, useState, useEffect } from 'react';
import userService from '../services/userService';

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
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
        
        // Получаем информацию о текущем пользователе
        const response = await userService.getCurrentUser();
        
        if (response.status === 200) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          // Если запрос не успешен, очищаем хранилище
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
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
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await userService.login(credentials);
      
      const { token, user } = response.data;
      
      // Сохраняем токен в локальное хранилище
      localStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setError(
        error.response?.data?.message || 
        'Произошла ошибка при авторизации. Пожалуйста, проверьте ваши учетные данные.'
      );
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка авторизации'
      };
    } finally {
      setLoading(false);
    }
  };

  // Функция для регистрации пользователя
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.register(userData);
      
      const { token, user } = response.data;
      
      // Сохраняем токен в локальное хранилище
      localStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setError(
        error.response?.data?.message || 
        'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.'
      );
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка регистрации'
      };
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = async () => {
    try {
      setLoading(true);
      
      // Вызываем API для выхода, если нужно
      await userService.logout();
      
      // Очищаем локальное хранилище
      localStorage.removeItem('token');
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
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
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.updateUserProfile(userData);
      
      setUser(response.data);
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setError(
        error.response?.data?.message || 
        'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте еще раз.'
      );
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка обновления профиля'
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Функция для проверки роли пользователя
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Передаем контекст и функции всем дочерним компонентам
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      hasRole
    }}>
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