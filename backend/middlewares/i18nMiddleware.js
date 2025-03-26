const i18n = require('i18n');
const path = require('path');

// Настройка i18n
i18n.configure({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,
  register: global,
});

// Middleware для определения языка
const i18nMiddleware = (req, res, next) => {
  // Определяем язык из заголовка Accept-Language или query параметра
  const lang = req.query.lang || req.acceptsLanguages(['ru', 'en']) || 'ru';

  // Устанавливаем язык для текущего запроса
  i18n.setLocale(req, lang);

  // Добавляем функцию перевода в объект ответа
  res.__ = i18n.__;
  res.__n = i18n.__n;

  next();
};

module.exports = i18nMiddleware;
