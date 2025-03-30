import { useState, useCallback } from 'react';

/**
 * Типы уведомлений
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Интерфейс для уведомления
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Интерфейс для опций уведомления
 */
export interface ToastOptions {
  autoClose?: boolean;
  duration?: number;
}

/**
 * Интерфейс для возвращаемого объекта хука useToast
 */
export interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, options?: ToastOptions) => string;
  closeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Хук для управления уведомлениями
 * @returns Объект с методами и свойствами для управления уведомлениями
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Функция для показа уведомления
  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      options?: ToastOptions
    ): string => {
      const id = Date.now().toString();
      const newToast: Toast = {
        id,
        message,
        type,
        autoClose: options?.autoClose === undefined ? true : options.autoClose,
        duration: options?.duration || 5000,
      };

      setToasts(prevToasts => [...prevToasts, newToast]);

      // Автоматическое закрытие
      if (newToast.autoClose) {
        setTimeout(() => {
          closeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    []
  );

  // Функция для закрытия уведомления
  const closeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Функция для очистки всех уведомлений
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    closeToast,
    clearToasts,
  };
} 