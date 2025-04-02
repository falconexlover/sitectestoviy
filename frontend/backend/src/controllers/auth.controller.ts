import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import dotenv from 'dotenv';

dotenv.config();

// Получаем данные администратора из переменных окружения
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'forest2023';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Инициализация админа при первом запуске
export const initializeAdmin = async (): Promise<void> => {
  try {
    // Проверяем, существует ли админ в базе
    const existingAdmin = await Admin.findOne({ username: ADMIN_LOGIN });
    
    if (!existingAdmin) {
      // Если админа нет, создаем его
      await Admin.create({
        username: ADMIN_LOGIN,
        password: ADMIN_PASSWORD
      });
      console.log('Администратор успешно создан');
    }
  } catch (error) {
    console.error('Ошибка инициализации администратора:', error);
  }
};

/**
 * Аутентификация администратора
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    // Проверяем, существует ли пользователь
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      res.status(400).json({ 
        success: false, 
        message: 'Неверное имя пользователя или пароль' 
      });
      return;
    }
    
    // Проверяем пароль
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      res.status(400).json({ 
        success: false, 
        message: 'Неверное имя пользователя или пароль' 
      });
      return;
    }
    
    // Создаем JWT токен
    const token = jwt.sign(
      { id: admin._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      success: true,
      token,
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      message: 'Произошла ошибка сервера'
    });
  }
}; 