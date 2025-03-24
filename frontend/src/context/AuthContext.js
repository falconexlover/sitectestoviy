import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Загрузка профиля пользователя
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки профиля');
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      setLoading(false);
    }
  };

  // Регистрация пользователя
  const register = async (userData) => {
    try {
      setLoading(true);
      await authService.register(userData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Вход пользователя
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при входе');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Обновление профиля
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(userData);
      const updatedUser = response.data.user;
      
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
      
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Изменение пароля
  const changePassword = async (passwords) => {
    try {
      setLoading(true);
      await authService.changePassword(passwords);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при изменении пароля');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    loadUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 