const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware для проверки JWT токена
const auth = (req, res, next) => {
  // Получаем токен из заголовка
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена, в доступе отказано' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Проверка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Токен недействителен' });
  }
};

module.exports = auth; 