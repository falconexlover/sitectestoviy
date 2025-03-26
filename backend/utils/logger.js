const winston = require('winston');
const path = require('path');
require('dotenv').config();

// Определяем форматы логирования
const formats = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Создаем корневую директорию для логов
const logDir = path.join(__dirname, '../logs');

// Настраиваем транспорты для логов
const transports = [
  // Всегда логгируем в консоль
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
      )
    ),
  }),
  // Логгируем в файл ошибки
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
  }),
  // Общий журнал для всех сообщений
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
  }),
];

// Создаем логгер
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: formats,
  defaultMeta: { service: 'lesnoy-dvorik-api' },
  transports: transports,
  // Не выходить из процесса при критических ошибках
  exitOnError: false,
});

// Функция для стандартизации формата ошибок
const formatError = (error, additionalInfo = {}) => {
  const baseInfo = {
    message: error.message,
    stack: error.stack,
  };

  // Добавляем дополнительный контекст, если есть
  const enhancedInfo = { ...baseInfo, ...additionalInfo };

  // Если в ошибке есть свойство cause, и оно тоже ошибка,
  // добавляем информацию о первопричине
  if (error.cause && error.cause instanceof Error) {
    enhancedInfo.cause = formatError(error.cause);
  }

  return enhancedInfo;
};

// Расширяем функциональность логгера
const enhancedLogger = {
  // Стандартные уровни логирования
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),

  // Расширенная функция логирования ошибок
  error: (message, errorOrMeta = {}) => {
    // Если второй аргумент - ошибка
    if (errorOrMeta instanceof Error) {
      logger.error(message, formatError(errorOrMeta));
    }
    // Если второй аргумент - объект с ошибкой
    else if (errorOrMeta.error instanceof Error) {
      const { error, ...meta } = errorOrMeta;
      logger.error(message, { ...formatError(error), ...meta });
    }
    // Если второй аргумент - просто метаданные
    else {
      logger.error(message, errorOrMeta);
    }
  },

  // Логирование HTTP-запросов
  http: (req, res, responseTime) => {
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    logger.http({
      method,
      url: originalUrl,
      status: statusCode,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent: req.headers['user-agent'] || '-',
    });
  },
};

module.exports = enhancedLogger;
