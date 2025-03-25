const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

// Необходимые middlewares
const i18nMiddleware = require('./middlewares/i18nMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/loggerMiddleware');
const logger = require('./utils/logger');

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

// Определяем режим работы
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Базовые настройки безопасности
app.use(helmet());

// Rate limiter для защиты от DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: isProduction ? 100 : 1000, // Ограничиваем количество запросов
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction // Отключаем в режиме разработки
});

// Применяем rate limiter ко всем маршрутам API
app.use('/api', apiLimiter);

// Настройка CORS для работы с frontend
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:3000'] 
  : ['https://lesnoy-dvorik.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // В режиме разработки разрешаем запросы без origin
    if (!origin && !isProduction) return callback(null, true);
    
    // Проверяем origin на соответствие разрешенным
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Доступ запрещен политикой CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 часа
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logger для HTTP запросов в режиме разработки
if (!isProduction) {
  app.use(morgan('dev'));
}

// Используем i18n middleware с проверкой на доступность
try {
  app.use(i18nMiddleware);
} catch (err) {
  logger.error('Ошибка инициализации i18n middleware:', err);
}

// Logger для запросов
if (typeof requestLogger === 'function') {
  app.use(requestLogger);
}

// Статические файлы (только для разработки)
if (!isVercel) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Конфигурация Swagger - отключаем в продакшне для безопасности
if (!isProduction) {
  const swaggerJsDoc = require('swagger-jsdoc');
  const swaggerUI = require('swagger-ui-express');
  
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
          url: process.env.API_URL || 'http://localhost:5000',
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
}

// Подключение к базе данных
try {
  if (!isVercel || (isVercel && isProduction)) {
    db.authenticate()
      .then(() => {
        logger.info('Подключение к базе данных установлено успешно.');
        return db.sync({ force: false, alter: false });
      })
      .then(() => {
        logger.info('Модели синхронизированы с базой данных.');
      })
      .catch(err => {
        logger.error('Ошибка при работе с базой данных:', err);
      });
  }
} catch (err) {
  logger.error('Критическая ошибка базы данных:', err);
}

// Версионирование API
const API_PREFIX = '/api/v1';

// Маршруты API
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/rooms`, roomRoutes);
app.use(`${API_PREFIX}/bookings`, bookingRoutes);
app.use(`${API_PREFIX}/customers`, customerRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);

// Обратная совместимость для старых API без версионирования
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/reviews', reviewRoutes);

// Проверка работоспособности сервера
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Обработка базового маршрута
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'API гостиничного комплекса "Лесной Дворик"',
    version: '1.0.0', 
    documentation: '/api-docs',
    health: '/health'
  });
});

// Middleware для логирования ошибок
if (typeof errorLogger === 'function') {
  app.use(errorLogger);
}

// Централизованная обработка 404 ошибок
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Маршрут не найден',
    path: req.path
  });
});

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Логирование через единый интерфейс
  const logError = logger.error || console.error;
  logError(`[Ошибка ${statusCode}]: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(statusCode).json({ 
    error: isProduction ? 'Внутренняя ошибка сервера' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// Запуск сервера в локальной среде
const PORT = process.env.PORT || 5000;
if (!isVercel) {
  app.listen(PORT, () => {
    logger.info(`Сервер запущен на порту ${PORT}`);
  });
}

// Экспорт для Vercel
module.exports = app; 