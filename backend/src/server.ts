import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Импорт маршрутов
import roomRoutes from './routes/roomRoutes';

// Загрузка переменных окружения
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты API
app.use('/api/rooms', roomRoutes);

// Базовый маршрут для проверки
app.get('/', (_req: Request, res: Response) => {
  res.send('API работает!');
});

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

export default app; 