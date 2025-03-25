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

// Middleware
app.use(cors());
app.use(express.json());
app.use(i18nMiddleware);
app.use(requestLogger);

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
        url: 'http://localhost:5000',
        description: 'Сервер разработки'
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

// Подключение к базе данных
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

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', reviewRoutes);

// Добавляем middleware для логирования ошибок
app.use(errorLogger);

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
}); 