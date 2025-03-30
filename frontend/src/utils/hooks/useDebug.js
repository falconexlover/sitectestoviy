import { useEffect, useRef } from 'react';
import { useStateTracking, usePerfTracking } from '../debugUtils';
import logger from '../logger';

/**
 * Хук для отладки React компонентов
 * 
 * @param {Object} options - Опции отладки
 * @param {string} options.componentName - Имя компонента для логирования
 * @param {boolean} options.logProps - Отслеживать изменения пропсов
 * @param {boolean} options.logState - Отслеживать изменения состояния
 * @param {boolean} options.logRenders - Отслеживать рендеринг компонента
 * @param {boolean} options.logLifecycle - Отслеживать жизненный цикл компонента
 * @param {boolean} options.trackPerformance - Отслеживать производительность
 * @param {Array} options.state - Состояние для отслеживания
 * @param {Object} options.props - Пропсы для отслеживания
 * @param {Array} options.dependencies - Зависимости для отслеживания обновлений
 * 
 * @returns {Object} Объект с полезными функциями отладки
 */
export const useDebug = ({
  componentName = 'Component',
  logProps = false,
  logState = false,
  logRenders = false,
  logLifecycle = false,
  trackPerformance = false,
  state = {},
  props = {},
  dependencies = []
}) => {
  const renderCount = useRef(0);
  
  // Отслеживание состояния
  if (logState) {
    useStateTracking(componentName, state);
  }
  
  // Отслеживание производительности
  if (trackPerformance) {
    usePerfTracking(componentName, [...dependencies, props]);
  }
  
  // Счетчик рендеров
  useEffect(() => {
    renderCount.current += 1;
    
    if (logRenders) {
      logger.debug(`${componentName} render #${renderCount.current}`);
    }
  });
  
  // Отслеживание пропсов
  useEffect(() => {
    if (logProps) {
      logger.trace(`${componentName} props обновлены:`, props);
    }
  }, [props, componentName, logProps]);
  
  // Отслеживание жизненного цикла
  useEffect(() => {
    if (logLifecycle) {
      logger.debug(`${componentName} смонтирован`);
      
      return () => {
        logger.debug(`${componentName} размонтирован`);
      };
    }
  }, [componentName, logLifecycle]);

  // Возвращаем полезные функции для отладки
  return {
    /**
     * Логировать произвольное сообщение с указанным уровнем
     * @param {string} level - Уровень логирования (trace, debug, info, warn, error)
     * @param {string} message - Сообщение для лога
     * @param {any} data - Дополнительные данные
     */
    log: (level, message, data) => {
      if (logger[level]) {
        logger[level](`[${componentName}] ${message}`, data);
      } else {
        logger.info(`[${componentName}] ${message}`, data);
      }
    },
    
    /**
     * Замерить производительность операции
     * @param {string} operation - Название операции
     * @param {Function} fn - Функция для замера
     * @returns {any} Результат выполнения функции
     */
    measure: (operation, fn) => {
      const startTime = performance.now();
      const result = fn();
      const endTime = performance.now();
      
      logger.perf(componentName, operation, Math.round(endTime - startTime));
      
      return result;
    },
    
    /**
     * Создать группу логов
     * @param {string} name - Название группы
     * @param {boolean} collapsed - Свернуть группу по умолчанию
     */
    group: (name, collapsed = false) => {
      logger.group(`[${componentName}] ${name}`, collapsed);
    },
    
    /**
     * Закрыть группу логов
     */
    groupEnd: () => {
      logger.groupEnd();
    },
    
    /**
     * Получить информацию о текущем рендере
     * @returns {Object} Информация о рендере
     */
    getRenderInfo: () => ({
      renderCount: renderCount.current,
      timestamp: new Date().toISOString(),
      componentName
    })
  };
}; 