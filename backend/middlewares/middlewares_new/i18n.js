const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const logger = require('../utils/logger');

// Инициализация i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en'],
    preload: ['ru', 'en'],
    ns: ['common', 'rooms', 'emails', 'errors'],
    defaultNS: 'common',
    detection: {
      order: ['querystring', 'cookie', 'header'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupHeader: 'accept-language',
      caches: ['cookie'],
      cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    },
    load: 'languageOnly',
    debug: process.env.NODE_ENV === 'development',
  });

// Логирование инициализации
i18next.on('initialized', () => {
  logger.info('i18next initialized');
});

// Логирование ошибок загрузки ресурсов
i18next.on('failedLoading', (lng, ns, msg) => {
  logger.error(`i18next failed loading: ${lng}/${ns} - ${msg}`);
});

const i18nMiddleware = middleware.handle(i18next);

module.exports = i18nMiddleware;
