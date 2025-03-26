const logger = require('../utils/logger');

/**
 * Middleware для логирования HTTP-запросов
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Function} next - функция next
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Добавляем слушателя события завершения запроса
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Логируем информацию о запросе
    logger.http(req, res, duration);
  });

  // Передаем управление следующему middleware
  next();
};

module.exports = requestLogger;
