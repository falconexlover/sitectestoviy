import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import galleryRoutes from './routes/gallery.routes';
import roomsRoutes from './routes/rooms.routes';
import homepageRoutes from './routes/homepage.routes';
import { initializeAdmin } from './controllers/auth.controller';
import { initializeHomePage } from './controllers/homepage.controller';

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к базе данных и инициализация начальных данных
(async () => {
  try {
    await connectDB();
    
    // Инициализация администратора
    await initializeAdmin();
    
    // Инициализация контента главной страницы
    await initializeHomePage();
    
    console.log('Начальные данные успешно инициализированы');
  } catch (error) {
    console.error('Ошибка инициализации начальных данных:', error);
  }
})();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/homepage', homepageRoutes);

// Проверка работоспособности сервера
app.get('/', (req, res) => {
  res.json({ message: 'API Лесной дворик работает!' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 