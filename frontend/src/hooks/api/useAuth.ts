import { useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LoginCredentials, RegisterData, User, UserRole } from '../../types/auth';
import { useLocalStorage } from '../core/useLocalStorage';

/**
 * Интерфейс для возвращаемого объекта хука useAuth
 */
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hasCheckedAuth: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  checkAuth: () => Promise<boolean>;
  resetError: () => void;
  setToken: (token: string) => void;
  removeToken: () => void;
}

/**
 * Хук для управления аутентификацией пользователя
 * @returns Объект с методами и свойствами для управления аутентификацией
 */
export function useAuth(): UseAuthReturn {
  const auth = useContext(AuthContext);
  
  // Добавляем дополнительные функции управления токеном
  const [token, setTokenValue] = useLocalStorage<string | null>('token', null);
  
  // Функция установки токена
  const setToken = useCallback((newToken: string) => {
    setTokenValue(newToken);
  }, [setTokenValue]);
  
  // Функция удаления токена
  const removeToken = useCallback(() => {
    setTokenValue(null);
  }, [setTokenValue]);
  
  if (auth === undefined || auth === null) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  
  return {
    ...auth,
    setToken,
    removeToken
  };
} 