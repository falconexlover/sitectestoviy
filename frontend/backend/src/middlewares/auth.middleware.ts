import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Расширяем интерфейс Request чтобы включить userId
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Получаем токен из заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Доступ запрещен. Требуется аутентификация.');
    }
    
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as { id: string };
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Доступ запрещен. Требуется аутентификация.'
    });
  }
}; 