const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/loggerMiddleware');
const logger = require('./utils/logger');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const i18nMiddleware = require('./middleware/i18nMiddleware');

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Инициализация приложения
const app = express();

// Настройка CORS для работы с frontend на Vercel
const allowedOrigins = process.env.FRONTEND_URL ? 
  [process.env.FRONTEND_URL, 'http://localhost:3000'] : 
  ['https://lesnoy-dvorik.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Разрешаем запросы без origin (например, от мобильных приложений или curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Не разрешено CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// В serverless среде Vercel некоторые middleware могут не работать корректно
// Проверяем наличие middleware перед использованием
if (i18nMiddleware) {
  app.use(i18nMiddleware);
}

if (requestLogger) {
  app.use(requestLogger);
}

// Конфигурация Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API гостиничного комплекса "Лесной Дворик"',
      version: '1.0.0',
      description: 'API для управления бронированиями, номерами и клиентами'
    },
    servers: [
      {
        url: process.env.API_URL || 'https://lesnoy-dvorik-backend.vercel.app',
        description: 'Сервер API'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Подключение к базе данных только в продакшн-окружении
// В Vercel мы будем использовать serverless функции
if (process.env.NODE_ENV !== 'development') {
  db.authenticate()
    .then(() => {
      logger.info('Подключение к базе данных установлено успешно.');
      // Синхронизация моделей с базой данных (в продакшн используйте миграции)
      return db.sync({ force: false });
    })
    .then(() => {
      logger.info('Модели синхронизированы с базой данных.');
    })
    .catch(err => {
      logger.error('Ошибка подключения к базе данных:', err);
    });
}

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', reviewRoutes);

// Проверка работоспособности сервера
app.get('/health', (req, res) => {
  res.status(200).send('Сервер работает');
});

// Обработка базового маршрута
app.get('/', (req, res) => {
  res.status(200).send('API гостиничного комплекса "Лесной Дворик"');
});

// Добавляем middleware для логирования ошибок
if (errorLogger) {
  app.use(errorLogger);
}

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

// Запуск сервера в локальной среде
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}

// Экспорт для Vercel
module.exports = app; 