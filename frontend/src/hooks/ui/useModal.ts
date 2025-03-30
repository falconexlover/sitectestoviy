import { useState, useCallback } from 'react';

/**
 * Интерфейс для состояния модального окна
 */
export interface ModalState {
  isOpen: boolean;
  data?: any;
}

/**
 * Интерфейс для возвращаемого объекта хука useModal
 */
export interface UseModalReturn {
  isOpen: boolean;
  data: any;
  openModal: (data?: any) => void;
  closeModal: () => void;
  toggleModal: () => void;
}

/**
 * Хук для управления модальными окнами
 * @param initialState Начальное состояние модального окна
 * @returns Объект с методами и свойствами для управления модальным окном
 */
export function useModal(initialState: boolean = false): UseModalReturn {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
    data: undefined,
  });

  // Функция для открытия модального окна
  const openModal = useCallback((data?: any) => {
    setState({ isOpen: true, data });
    
    // Блокируем прокрутку страницы
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  // Функция для закрытия модального окна
  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
    
    // Восстанавливаем прокрутку
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }, []);

  // Функция для переключения состояния модального окна
  const toggleModal = useCallback(() => {
    setState(prev => {
      const newIsOpen = !prev.isOpen;
      
      // Управляем прокруткой
      if (typeof document !== 'undefined') {
        document.body.style.overflow = newIsOpen ? 'hidden' : 'auto';
      }
      
      return {
        ...prev,
        isOpen: newIsOpen,
      };
    });
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    openModal,
    closeModal,
    toggleModal,
  };
} 