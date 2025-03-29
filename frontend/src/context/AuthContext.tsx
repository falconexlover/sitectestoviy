import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import logger from '../utils/logger';
import { 
  User, 
  AuthContextType, 
  LoginCredentials, 
  RegisterData,
  AuthState
} from '../types/auth';
import { AxiosError } from 'axios';

// Создаем контекст авторизации с правильным типом
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  hasCheckedAuth: false,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  updateProfile: async () => false,
  checkAuth: async () => false,
  hasRole: () => false,
  resetError: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

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
          setHasCheckedAuth(true);
          return;
        }

        logger.debug('Проверка авторизации с существующим токеном');

        // Получаем информацию о текущем пользователе
        const response = await authService.getProfile();

        if (response.status === 200) {
          logger.info('Пользователь успешно аутентифицирован');
          setUser(response.data.user);
          setIsAuthenticated(true);
          setHasCheckedAuth(true);
        } else {
          // Если запрос не успешен, очищаем хранилище
          logger.warn('Получен некорректный ответ при проверке авторизации:', response.status);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setHasCheckedAuth(true);
        }
      } catch (error) {
        logger.error('Ошибка при проверке авторизации:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setError('Ошибка при проверке авторизации');
        setHasCheckedAuth(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция для авторизации пользователя
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      throw new Error('Токен не получен');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || 'Произошла ошибка при входе';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для регистрации пользователя
  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      throw new Error('Токен не получен');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || 'Произошла ошибка при регистрации';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Функция для обновления данных пользователя
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.updateProfile(userData);
      
      if (response.status === 200) {
        setUser(prev => prev ? { ...prev, ...response.data } : null);
        return true;
      } else {
        setError(response.message || 'Ошибка обновления профиля');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Произошла ошибка при обновлении профиля';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Проверка наличия роли у пользователя
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  // Функция для проверки авторизации пользователя
  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setHasCheckedAuth(true);
        return false;
      }
      
      const response = await authService.getProfile();
      
      if (response.status === 200) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setHasCheckedAuth(true);
        return true;
      } else {
        logout();
        setHasCheckedAuth(true);
        return false;
      }
    } catch (err) {
      console.error('Ошибка при проверке авторизации:', err);
      logout();
      setHasCheckedAuth(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для сброса ошибок
  const resetError = (): void => {
    setError(null);
  };

  // Передаем контекст и функции всем дочерним компонентам
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        hasCheckedAuth,
        login,
        register,
        logout,
        updateProfile,
        hasRole,
        checkAuth,
        resetError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Для удобства использования контекста в компонентах
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 