const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

// Middleware для проверки JWT
exports.auth = async (req, res, next) => {
  try {
    // Получаем токен из заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      logger.warn('Попытка доступа без токена аутентификации');
      return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Находим пользователя
    const user = await User.findByPk(decoded.id);
    if (!user) {
      logger.warn(`Попытка доступа с недействительным токеном: ${decoded.id}`);
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    // Добавляем пользователя в объект запроса
    req.user = { id: user.id, role: user.role };

    logger.debug(`Пользователь ${user.id} (${user.role}) аутентифицирован`);
    next();
  } catch (err) {
    logger.error(`Ошибка аутентификации: ${err.message}`);
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Middleware для проверки роли администратора
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    logger.warn(`Пользователь ${req.user.id} попытался получить доступ к функции администратора`);
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  logger.debug(`Администратор ${req.user.id} получил доступ к защищенной функции`);
  next();
};

// Middleware для проверки роли менеджера или администратора
exports.staffOnly = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    logger.warn(
      `Пользователь ${req.user.id} попытался получить доступ к защищенной функции персонала`
    );
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  logger.debug(`Сотрудник ${req.user.id} (${req.user.role}) получил доступ к защищенной функции`);
  next();
};

// Middleware для ограничения доступа по ролям
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Пользователь ${req.user.id} (${req.user.role}) попытался получить доступ к защищенной функции, доступной только для: ${roles.join(', ')}`
      );
      return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
    }
    logger.debug(`Пользователь ${req.user.id} (${req.user.role}) получил доступ к защищенной функции`);
    next();
  };
};
