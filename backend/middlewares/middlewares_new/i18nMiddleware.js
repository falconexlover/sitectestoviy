const i18next = require('../config/i18n');

/**
 * Middleware для интернационализации
 * Определяет язык запроса по заголовкам или параметрам
 * и добавляет функции перевода в request
 */
const i18nMiddleware = (req, res, next) => {
  // Определяем язык запроса
  const lng = req.query.lang || 
              req.headers['accept-language'] || 
              'ru'; // По умолчанию русский
  
  // Сохраняем выбранный язык
  req.language = lng.substring(0, 2).toLowerCase();
  
  // Добавляем функцию перевода
  req.t = (key, options) => {
    return i18next.t(key, { 
      lng: req.language, 
      ...options 
    });
  };
  
  // Добавляем специальную функцию для перевода ошибок
  req.tError = (key, options) => {
    return i18next.t(`errors:${key}`, { 
      lng: req.language, 
      ...options 
    });
  };
  
  next();
};

module.exports = i18nMiddleware; 