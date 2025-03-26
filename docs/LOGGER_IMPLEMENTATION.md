# Реализация системы логирования в проекте "Лесной Дворик"

Данный документ описывает архитектуру и реализацию системы логирования в проекте гостиничного комплекса "Лесной Дворик". Система логирования использует библиотеку Winston для создания структурированных логов и обеспечения различных уровней логирования.

## Структура системы логирования

### Основные компоненты:

1. **Конфигурация Winston** (`backend/config/winston.js`)
2. **Утилита логирования** (`backend/utils/logger.js`)
3. **Middleware для логирования HTTP-запросов** (`backend/middlewares/loggerMiddleware.js`)
4. **Файлы журналов** (хранятся в `backend/logs/`)

## Конфигурация логирования

### Уровни логирования

В системе используются следующие уровни логирования (в порядке возрастания приоритета):

- **debug**: Подробная информация для диагностики и разработки
- **info**: Информационные сообщения о нормальной работе приложения
- **warn**: Предупреждения о потенциальных проблемах
- **error**: Ошибки, которые не останавливают работу приложения
- **fatal**: Критические ошибки, приводящие к остановке приложения

### Реализация конфигурации Winston

Файл `backend/config/winston.js` содержит настройки для логгера:

```javascript
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;
const path = require('path');
const fs = require('fs');

// Создание директории для логов, если она не существует
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Формат для консольного вывода
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

// Настройка логгера
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
  defaultMeta: { service: 'hotel-api' },
  transports: [
    // Запись логов в файлы
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

// Добавление консольного транспорта для dev-окружения
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), consoleFormat),
    })
  );
}

module.exports = logger;
```

## Утилита для логирования

Файл `backend/utils/logger.js` представляет собой обертку над Winston для удобного использования:

```javascript
const winston = require('../config/winston');

const logger = {
  debug: (message, meta = {}) => {
    winston.debug(message, meta);
  },

  info: (message, meta = {}) => {
    winston.info(message, meta);
  },

  warn: (message, meta = {}) => {
    winston.warn(message, meta);
  },

  error: (message, meta = {}) => {
    winston.error(message, meta);
  },

  fatal: (message, meta = {}) => {
    winston.error(`FATAL: ${message}`, meta);
    // В случае фатальной ошибки можно добавить дополнительные действия
    // например, отправку уведомления администратору
  },

  // Вспомогательные методы для логирования определенных событий

  // Логирование действий пользователя
  userAction: (userId, action, details = {}) => {
    winston.info(`User Action: ${action}`, { userId, ...details });
  },

  // Логирование событий бронирования
  bookingEvent: (bookingId, event, details = {}) => {
    winston.info(`Booking Event: ${event}`, { bookingId, ...details });
  },

  // Логирование событий аутентификации
  authEvent: (userId, event, details = {}) => {
    winston.info(`Auth Event: ${event}`, { userId, ...details });
  },

  // Логирование ошибок API
  apiError: (req, error) => {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user ? req.user.id : 'unauthenticated',
    };

    if (error.stack) {
      meta.stack = error.stack;
    }

    winston.error(`API Error: ${error.message}`, meta);
  },
};

module.exports = logger;
```

## Middleware для логирования HTTP-запросов

Файл `backend/middlewares/loggerMiddleware.js` для логирования входящих запросов:

```javascript
const logger = require('../utils/logger');

/**
 * Middleware для логирования HTTP-запросов
 */
const loggerMiddleware = (req, res, next) => {
  // Сохраняем время начала запроса
  const start = Date.now();

  // Обработчик на завершение запроса
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Подготовка метаданных для лога
    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };

    // Добавляем ID пользователя, если запрос аутентифицирован
    if (req.user) {
      meta.userId = req.user.id;
      meta.role = req.user.role;
    }

    // Выбираем уровень логирования в зависимости от статус-кода
    if (res.statusCode >= 500) {
      logger.error(`HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, meta);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, meta);
    } else {
      logger.info(`HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, meta);
    }
  });

  // Продолжаем обработку запроса
  next();
};

module.exports = loggerMiddleware;
```

## Интеграция в приложение

### В файле `backend/server.js`:

```javascript
const express = require('express');
const app = express();
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const logger = require('./utils/logger');

// Применяем middleware для логирования HTTP-запросов
app.use(loggerMiddleware);

// ... другие настройки приложения ...

// Обработчик необработанных ошибок
process.on('uncaughtException', error => {
  logger.fatal(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  // Безопасно завершаем процесс
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal('Unhandled Rejection', { reason, promise });
  // Безопасно завершаем процесс
  process.exit(1);
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { environment: process.env.NODE_ENV });
});
```

## Использование логгера в коде

### Примеры использования в контроллерах:

```javascript
const logger = require('../utils/logger');

// Контроллер аутентификации
exports.login = async (req, res) => {
  try {
    // ... логика аутентификации ...

    logger.authEvent(user.id, 'login', { ip: req.ip });

    return res.status(200).json({ token });
  } catch (err) {
    logger.apiError(req, err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Контроллер бронирования
exports.createBooking = async (req, res) => {
  try {
    // ... логика создания бронирования ...

    logger.bookingEvent(booking.id, 'created', {
      userId: req.user.id,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    });

    return res.status(201).json(booking);
  } catch (err) {
    logger.apiError(req, err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};
```

## Ротация и хранение логов

Для ротации логов используются встроенные возможности Winston:

1. **Максимальный размер файла**: 5 МБ для каждого файла лога
2. **Максимальное количество файлов**: 5 файлов для каждого типа лога
3. **Хранение ошибок**: отдельный файл `error.log` для сообщений уровня error и выше
4. **Комбинированные логи**: файл `combined.log` для всех уровней логирования

## Рекомендации по использованию

1. **Использовать правильные уровни логирования**:

   - `debug`: только для отладки
   - `info`: для обычных операций
   - `warn`: для потенциальных проблем
   - `error`: для ошибок в приложении
   - `fatal`: только для критических ошибок

2. **Структурированное логирование**:

   - Использовать метаданные для дополнительной информации
   - Не включать конфиденциальные данные (пароли, токены)
   - Логировать идентификаторы сущностей (userId, bookingId)

3. **Контроль объема логов**:

   - Не логировать избыточную информацию
   - Использовать уровень `debug` только в разработке

4. **Мониторинг логов**:
   - Регулярно просматривать логи ошибок
   - Настроить оповещения о критических ошибках
