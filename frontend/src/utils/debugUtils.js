/**
 * Утилиты для отладки React компонентов и приложения
 */
import React, { useEffect, useCallback } from 'react';
import logger from './logger';

/**
 * HOC для отслеживания жизненного цикла компонента
 * @param {React.Component} WrappedComponent - Компонент для отслеживания
 * @returns {React.Component} Обернутый компонент с отладкой
 */
export const withComponentTracking = WrappedComponent => {
  // Получаем отображаемое имя компонента
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Создаем новый компонент с отслеживанием
  function TrackingComponent(props) {
    const handlePropsUpdate = useCallback(() => {
      logger.trace(`${displayName} обновлен`, { props });
    }, [props]);

    useEffect(() => {
      logger.debug(`${displayName} смонтирован`, { props });

      // Измеряем время рендеринга
      const renderStartTime = performance.now();

      return () => {
        const renderTime = performance.now() - renderStartTime;
        logger.debug(`${displayName} размонтирован после ${Math.round(renderTime)}ms`);
      };
    }, [props]);

    // Логируем обновления пропсов
    useEffect(() => {
      handlePropsUpdate();
    }, [handlePropsUpdate]);

    // Время первого рендеринга
    const startTime = performance.now();
    const result = <WrappedComponent {...props} />;
    const renderTime = performance.now() - startTime;

    logger.perf(displayName, 'render', Math.round(renderTime));

    return result;
  }

  // Устанавливаем displayName для DevTools
  TrackingComponent.displayName = `Tracked(${displayName})`;

  return TrackingComponent;
};

/**
 * Хук для трассировки изменений в стейте
 * @param {string} componentName - Имя компонента
 * @param {Object} state - Объект состояния для трассировки
 */
export const useStateTracking = (componentName, state) => {
  useEffect(() => {
    logger.trace(`${componentName} state изменился:`, state);
  }, [state, componentName]);
};

/**
 * Хук для измерения производительности компонента
 * @param {string} componentName - Имя компонента
 * @param {Array} dependencies - Массив зависимостей для отслеживания
 */
export const usePerfTracking = (componentName, dependencies) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      logger.perf(componentName, 'update', Math.round(endTime - startTime));
    };
  }, [componentName, dependencies]);
};

/**
 * Обертка для глобальной отладки состояния приложения
 */
export const setupDebugListeners = () => {
  // Логируем навигацию между страницами
  const originalPushState = window.history.pushState;
  window.history.pushState = function () {
    logger.debug(`Навигация: ${arguments[2]}`);
    return originalPushState.apply(this, arguments);
  };

  // Логируем нажатия клавиш для отладки
  window.addEventListener('keydown', e => {
    // Ctrl+Shift+D - включить режим отладки
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      const debugMode = localStorage.getItem('debug_mode') === 'true';
      localStorage.setItem('debug_mode', (!debugMode).toString());
      logger.info(`Режим отладки ${!debugMode ? 'включен' : 'выключен'}`);

      // Добавляем стили для визуального отображения режима отладки
      if (!debugMode) {
        const style = document.createElement('style');
        style.id = 'debug-mode-styles';
        style.innerHTML = `
          * { outline: 1px solid rgba(255, 0, 0, 0.1); }
          div:hover { outline: 1px solid rgba(255, 0, 0, 0.4); }
        `;
        document.head.appendChild(style);
      } else {
        const debugStyles = document.getElementById('debug-mode-styles');
        if (debugStyles) debugStyles.remove();
      }
    }
  });

  // Логируем события загрузки ресурсов
  performance.onresourcetimingbufferfull = () => {
    logger.warn('Буфер производительности ресурсов переполнен');
  };

  // Логируем ошибки загрузки ресурсов
  window.addEventListener(
    'error',
    e => {
      if (
        e.target &&
        (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')
      ) {
        logger.error(`Ошибка загрузки ресурса: ${e.target.src || e.target.href}`, e);
      }
    },
    true
  );

  // Проверяем соединение с бэкендом каждые 30 секунд
  setInterval(() => {
    const isOnline = navigator.onLine;
    if (isOnline) {
      fetch(`${process.env.REACT_APP_API_URL}/health`, { method: 'GET', mode: 'no-cors' })
        .then(() => logger.trace('Соединение с бэкендом активно'))
        .catch(err => logger.warn('Проблема соединения с бэкендом', err));
    } else {
      logger.warn('Нет соединения с интернетом');
    }
  }, 30000);

  logger.info('Отладочные слушатели установлены');
};

/**
 * Получение информации об окружении
 * @returns {Object} Информация об окружении
 */
export const getEnvironmentInfo = () => {
  const env = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio,
    online: navigator.onLine,
    apiUrl: process.env.REACT_APP_API_URL,
    environment: process.env.REACT_APP_ENVIRONMENT,
    timestamp: new Date().toISOString(),
    localStorage: Object.keys(localStorage),
    sessionStorage: Object.keys(sessionStorage),
    cookies: document.cookie,
    performance: {
      memory: performance.memory
        ? {
            jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024)),
            totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024)),
            usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024)),
          }
        : 'Not available',
      navigation: performance.timing
        ? {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domReady: performance.timing.domComplete - performance.timing.domLoading,
            networkLatency: performance.timing.responseEnd - performance.timing.requestStart,
          }
        : 'Not available',
    },
  };

  return env;
};

/**
 * Анализатор DOM для поиска потенциальных проблем
 */
export const analyzeDom = () => {
  logger.group('Анализ DOM', true);

  // Проверка на слишком много элементов
  const totalElements = document.querySelectorAll('*').length;
  logger.debug(`Всего элементов в DOM: ${totalElements}`);

  if (totalElements > 1500) {
    logger.warn(
      `Слишком много DOM элементов (${totalElements}), что может вызвать проблемы с производительностью`
    );
  }

  // Поиск глубоко вложенных элементов
  const deepElements = Array.from(document.querySelectorAll('*')).filter(el => {
    let depth = 0;
    let current = el;
    while (current) {
      depth++;
      current = current.parentElement;
    }
    return depth > 15;
  });

  if (deepElements.length > 0) {
    logger.warn(`Найдено ${deepElements.length} элементов с глубокой вложенностью (> 15)`);
  }

  // Проверка на наличие бесконечных стилей
  const infiniteElements = Array.from(document.querySelectorAll('*')).filter(el => {
    const style = window.getComputedStyle(el);
    return style.width === 'auto' && style.maxWidth === 'none' && style.position !== 'static';
  });

  if (infiniteElements.length > 0) {
    logger.warn(`Найдено ${infiniteElements.length} элементов с потенциально опасными стилями`);
  }

  logger.groupEnd();
};

/**
 * Компонент для отладки состояния приложения
 */
export const DebugPanel = ({ visible = false }) => {
  const toggleDebugPanel = () => {
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  };

  const runAnalysis = () => {
    const env = getEnvironmentInfo();
    logger.debug('Информация об окружении:', env);
    analyzeDom();
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        toggleDebugPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!visible && process.env.NODE_ENV !== 'development') return null;

  const style = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 9999,
    fontSize: '12px',
    display: 'none',
    maxWidth: '300px',
    maxHeight: '400px',
    overflow: 'auto',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    marginRight: '5px',
    marginBottom: '5px',
    cursor: 'pointer',
  };

  return (
    <div id="debug-panel" style={style}>
      <h4 style={{ margin: '0 0 10px' }}>Панель отладки</h4>
      <div>
        <button style={buttonStyle} onClick={runAnalysis}>
          Анализировать
        </button>
        <button style={buttonStyle} onClick={() => logger.saveLogsToFile()}>
          Скачать логи
        </button>
        <button style={buttonStyle} onClick={() => localStorage.clear()}>
          Очистить хранилище
        </button>
        <button style={buttonStyle} onClick={toggleDebugPanel}>
          Закрыть
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>API URL:</strong> {process.env.REACT_APP_API_URL}
        <br />
        <strong>Режим:</strong> {process.env.NODE_ENV}
        <br />
        <strong>Размер окна:</strong> {window.innerWidth}x{window.innerHeight}
      </div>
    </div>
  );
};

const debugUtils = {
  useStateTracking,
  usePerfTracking,
  setupDebugListeners,
  getEnvironmentInfo,
  analyzeDom,
  DebugPanel
};

export default debugUtils;
