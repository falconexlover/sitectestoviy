/**
 * Класс для пользовательских ошибок приложения
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Сообщение об ошибке
   * @param {number} statusCode - HTTP-статус ошибки
   * @param {string} code - Код ошибки для клиента
   * @param {*} details - Дополнительные детали ошибки
   * @param {Error} cause - Причина ошибки (базовая ошибка)
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null, cause = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.cause = cause;

    // Правильное имя класса в стеке ошибок
    this.name = this.constructor.name;

    // Захватываем стек ошибки
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Создание ошибки Bad Request (400)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @returns {AppError} Экземпляр AppError
   */
  static badRequest(message = 'Неверный запрос', code = 'BAD_REQUEST', details = null) {
    return new AppError(message, 400, code, details);
  }

  /**
   * Создание ошибки Unauthorized (401)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @returns {AppError} Экземпляр AppError
   */
  static unauthorized(message = 'Требуется авторизация', code = 'UNAUTHORIZED', details = null) {
    return new AppError(message, 401, code, details);
  }

  /**
   * Создание ошибки Forbidden (403)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @returns {AppError} Экземпляр AppError
   */
  static forbidden(message = 'Доступ запрещен', code = 'FORBIDDEN', details = null) {
    return new AppError(message, 403, code, details);
  }

  /**
   * Создание ошибки Not Found (404)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @returns {AppError} Экземпляр AppError
   */
  static notFound(message = 'Ресурс не найден', code = 'NOT_FOUND', details = null) {
    return new AppError(message, 404, code, details);
  }

  /**
   * Создание ошибки Validation Error (422)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @returns {AppError} Экземпляр AppError
   */
  static validation(message = 'Ошибка валидации', code = 'VALIDATION_ERROR', details = null) {
    return new AppError(message, 422, code, details);
  }

  /**
   * Создание ошибки Conflict (409)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @returns {AppError} Экземпляр AppError
   */
  static conflict(message = 'Конфликт данных', code = 'CONFLICT', details = null) {
    return new AppError(message, 409, code, details);
  }

  /**
   * Создание ошибки Internal Server Error (500)
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   * @param {*} details - Дополнительные детали
   * @param {Error} cause - Причина ошибки
   * @returns {AppError} Экземпляр AppError
   */
  static internal(
    message = 'Внутренняя ошибка сервера',
    code = 'INTERNAL_ERROR',
    details = null,
    cause = null
  ) {
    return new AppError(message, 500, code, details, cause);
  }
}

module.exports = AppError;
