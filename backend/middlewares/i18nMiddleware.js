const i18next = require('i18next');
const { LanguageDetector } = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');
const fs = require('fs');

// Проверяем, работаем ли мы в среде Vercel
const isVercel = process.env.VERCEL === '1';

// Middleware инициализации i18n
const initI18nMiddleware = async (req, res, next) => {
  try {
    if (!i18next.isInitialized) {
      const localesPath = path.join(__dirname, '../locales');
      const languageOptions = {
        order: ['querystring', 'cookie', 'header'],
        lookupQuerystring: 'lang',
        lookupCookie: 'lang',
        lookupHeader: 'accept-language',
        caches: ['cookie']
      };

      // В среде Vercel нам нужна другая стратегия загрузки переводов
      if (isVercel) {
        // Упрощенная инициализация i18n для Vercel
        await i18next
          .use(LanguageDetector)
          .init({
            detection: languageOptions,
            fallbackLng: 'ru',
            supportedLngs: ['ru', 'en'],
            preload: ['ru', 'en'],
            resources: {
              ru: {
                translation: require('../locales/ru/translation.json')
              },
              en: {
                translation: require('../locales/en/translation.json')
              }
            }
          });
      } else {
        // Проверяем существование директории с локализациями
        if (!fs.existsSync(localesPath)) {
          fs.mkdirSync(localesPath, { recursive: true });
          
          // Создаем базовые директории для языков
          fs.mkdirSync(path.join(localesPath, 'ru'), { recursive: true });
          fs.mkdirSync(path.join(localesPath, 'en'), { recursive: true });
          
          // Создаем базовые файлы переводов
          const baseTranslation = { welcome: 'Добро пожаловать' };
          fs.writeFileSync(
            path.join(localesPath, 'ru', 'translation.json'),
            JSON.stringify(baseTranslation, null, 2),
            'utf8'
          );
          
          const enTranslation = { welcome: 'Welcome' };
          fs.writeFileSync(
            path.join(localesPath, 'en', 'translation.json'),
            JSON.stringify(enTranslation, null, 2),
            'utf8'
          );
        }

        // Полная инициализация i18n для локальной разработки
        await i18next
          .use(Backend)
          .use(LanguageDetector)
          .init({
            backend: {
              loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json')
            },
            detection: languageOptions,
            fallbackLng: 'ru',
            supportedLngs: ['ru', 'en'],
            preload: ['ru', 'en']
          });
      }
    }

    // Привязываем i18n к запросу
    req.i18n = i18next;
    req.t = i18next.t.bind(i18next);

    next();
  } catch (error) {
    console.error('Error initializing i18n middleware:', error);
    next();
  }
};

module.exports = initI18nMiddleware; 