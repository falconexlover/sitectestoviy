const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Инициализация приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе данных
db.authenticate()
  .then(() => {
    console.log('Подключение к базе данных установлено успешно.');
    // Синхронизация моделей с базой данных (в продакшн используйте миграции)
    return db.sync({ alter: true });
  })
  .then(() => {
    console.log('Модели синхронизированы с базой данных.');
  })
  .catch(err => {
    console.error('Ошибка подключения к базе данных:', err);
  });

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 