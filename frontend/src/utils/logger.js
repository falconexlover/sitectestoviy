/**
 * Улучшенная утилита для логирования с максимальным количеством деталей
 */

// Определяем уровни логирования и их численные значения
const LOG_LEVELS = {
  TRACE: -1, // Добавляем уровень трассировки для максимальной детализации
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Получаем текущий уровень логирования из переменных окружения
// Устанавливаем TRACE для максимальной детализации
const getCurrentLevel = () => {
  // Временно устанавливаем уровень TRACE для отладки
  return LOG_LEVELS.TRACE;
};

// Текущий уровень логирования
const currentLevel = getCurrentLevel();

// Функция для проверки, нужно ли логировать сообщение данного уровня
const shouldLog = level => {
  return level >= currentLevel;
};

// Добавляем контекст к сообщениям
const addContext = message => {
  const timestamp = new Date().toISOString();
  const browserInfo = `${navigator.userAgent}`;
  const screenInfo = `${window.innerWidth}x${window.innerHeight}`;

  return `[${timestamp}] [${browserInfo}] [${screenInfo}] ${message}`;
};

// Стили для разных уровней логирования
const STYLES = {
  TRACE: 'color: #a0a0a0; font-weight: bold;',
  DEBUG: 'color: #6c757d; font-weight: bold;',
  INFO: 'color: #0d6efd; font-weight: bold;',
  WARN: 'color: #ffc107; font-weight: bold; background: #332b00',
  ERROR: 'color: #dc3545; font-weight: bold; background: #330000',
};

// Получение стека вызовов
const getStackTrace = () => {
  const stack = new Error().stack || '';
  // Фильтруем стек, чтобы убрать лишние строки (1-2 строки самого logger)
  return stack.split('\n').slice(3).join('\n');
};

// Основные функции логирования
const logger = {
  trace: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.TRACE)) {
      const stackTrace = getStackTrace();
      console.debug(
        `%c[TRACE]`,
        STYLES.TRACE,
        addContext(message),
        ...args,
        '\nStack trace:',
        stackTrace
      );
    }
  },

  debug: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.debug(`%c[DEBUG]`, STYLES.DEBUG, addContext(message), ...args);
    }
  },

  info: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.INFO)) {
      console.info(`%c[INFO]`, STYLES.INFO, addContext(message), ...args);
    }
  },

  warn: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.WARN)) {
      console.warn(`%c[WARN]`, STYLES.WARN, addContext(message), ...args);
    }
  },

  error: (message, error, ...args) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      console.error(`%c[ERROR]`, STYLES.ERROR, addContext(message), error, ...args);

      // Запись в localStorage для последующего анализа
      try {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push({
          timestamp: new Date().toISOString(),
          message,
          error: error?.toString?.() || 'Unknown error',
          stack: error?.stack,
          url: window.location.href,
          componentStack: args[0]?.componentStack,
        });
        // Храним только последние 20 ошибок
        if (errors.length > 20) errors.shift();
        localStorage.setItem('app_errors', JSON.stringify(errors));
      } catch (e) {
        console.error('Ошибка при сохранении лога ошибок:', e);
      }

      // Отправка ошибок на сервер аналитики, если настроено
      if (process.env.REACT_APP_ANALYTICS_ID && typeof error === 'object') {
        try {
          // Здесь можно добавить код для отправки ошибок на сервер
          // например, через Google Analytics или другой сервис
        } catch (e) {
          console.error('Failed to send error to analytics', e);
        }
      }
    }
  },

  // Логирование производительности компонентов
  perf: (label, operation, time) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.debug(
        `%c[PERF]`,
        'color: #9333ea; font-weight: bold;',
        `${label} - ${operation}: ${time}ms`
      );
    }
  },

  // Логирование HTTP запросов
  http: (method, url, status, time) => {
    const color =
      status >= 400
        ? STYLES.ERROR
        : status >= 300
          ? STYLES.WARN
          : 'color: #22c55e; font-weight: bold;';
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.debug(`%c[HTTP]`, color, `${method} ${url} ${status} - ${time}ms`);
    }
  },

  // Группировка логов
  group: (label, collapsed = false) => {
    if (collapsed) {
      console.groupCollapsed(label);
    } else {
      console.group(label);
    }
  },

  groupEnd: () => {
    console.groupEnd();
  },

  // Измерение времени выполнения
  time: label => {
    console.time(label);
  },

  timeEnd: label => {
    console.timeEnd(label);
  },

  // Сохранить все логи в файл (доступно только из консоли браузера)
  saveLogsToFile: () => {
    try {
      const logs = JSON.parse(localStorage.getItem('app_errors') || '[]');
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `app-errors-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.info('Логи успешно сохранены в файл');
    } catch (e) {
      console.error('Ошибка при сохранении логов:', e);
    }
  },
};

// Экспортируем как синглтон
export default logger;
