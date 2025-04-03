const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Контроллер для аутентификации администратора
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверяем, совпадают ли данные с заданными в .env
    const isCorrectUsername = username === process.env.ADMIN_USERNAME;
    // Для простоты используем обычное сравнение, но в реальном проекте лучше использовать bcrypt
    const isCorrectPassword = password === process.env.ADMIN_PASSWORD;

    if (!isCorrectUsername || !isCorrectPassword) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Отправляем токен клиенту
    res.json({
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Контроллер для проверки статуса аутентификации
exports.checkAuth = (req, res) => {
  res.status(200).json({ isAuthenticated: true });
}; 