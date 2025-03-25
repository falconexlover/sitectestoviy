const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const i18nMiddleware = require('./middleware/i18nMiddleware');

// Создание экземпляра приложения
const app = express();

// Промежуточное ПО безопасности
app.use(helmet()); // HTTP-заголовки безопасности

// Интернационализация
app.use(i18nMiddleware);

// Парсинг тела запроса
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api', require('./routes/reviewRoutes')); // Новые маршруты для отзывов

// Обработка ошибок
// ... existing code ...

module.exports = app; 