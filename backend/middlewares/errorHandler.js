const logger = require('../utils/logger');

/**
 * Middleware для глобальной обработки ошибок
 * @param {Error} err - объект ошибки
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Function} _next - функция next
 */
const errorHandler = (err, req, res, _next) => {
  // Логирование ошибки
  logger.error('Глобальная ошибка приложения:', err);

  // Получаем информацию из ошибки
  const statusCode = err.statusCode || 500;

  // Формируем ответ с ошибкой
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Внутренняя ошибка сервера',
      code: err.code || 'INTERNAL_ERROR',
    },
  };

  // В разработке добавляем стек ошибки
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err.details || null;
  }

  // Отправляем ответ с соответствующим статусом
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
