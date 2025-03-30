import { useEffect, useRef } from 'react';

/**
 * Хук для отслеживания кликов вне указанного элемента
 * 
 * @param {Function} handler - Функция-обработчик, вызываемая при клике вне элемента
 * @param {boolean} active - Флаг активности хука
 * @returns {Object} ref - Реф, который нужно присвоить элементу
 * 
 * @example
 * const { ref } = useOnClickOutside(() => setIsOpen(false));
 * return (
 *   <div ref={ref}>
 *     Контент, который должен быть закрыт при клике вне него
 *   </div>
 * );
 */
export const useOnClickOutside = (handler, active = true) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!active) return;
    
    const listener = (event) => {
      // Не делаем ничего, если нет ссылки на элемент или клик произошел внутри элемента
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      
      handler(event);
    };
    
    // Добавляем слушатели событий на mousedown и touchstart
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    // Удаляем слушатели при размонтировании
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, active]);
  
  return { ref };
}; 