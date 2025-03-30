/**
 * Middleware для валидации запросов с использованием express-validator
 */
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Проверяет результаты валидации и возвращает ошибки в случае их наличия
 * @param {Object} req - Express запрос
 * @param {Object} res - Express ответ
 * @param {Function} next - Express функция next
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
    
    logger.warn(`Ошибка валидации: ${JSON.stringify(errorMessages)}`);
    
    return res.status(400).json({
      success: false,
      errors: errorMessages
    });
  }
  
  next();
};

module.exports = validate; 