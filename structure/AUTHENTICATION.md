# Система аутентификации и авторизации в проекте "Лесной Дворик"

Данный документ описывает реализацию аутентификации и авторизации в проекте гостиничного комплекса "Лесной Дворик". Система использует JWT (JSON Web Tokens) для управления сессиями пользователей и контроля доступа к ресурсам.

## Общая архитектура

Система аутентификации и авторизации состоит из следующих компонентов:

1. **Контроллер аутентификации** - обрабатывает регистрацию, вход и выход пользователей
2. **Middleware авторизации** - проверяет JWT токены и права доступа
3. **Модель пользователя** - хранит учетные данные и роли пользователей
4. **JWT утилиты** - генерация и проверка токенов

## Модель пользователя

Пользователи системы хранятся в таблице `Users` и могут иметь одну из следующих ролей:

- **customer** - обычный клиент гостиницы
- **manager** - сотрудник гостиницы с ограниченными правами
- **admin** - администратор с полным доступом

Пароли пользователей хранятся в хешированном виде с использованием bcrypt.

## Процесс аутентификации

### Регистрация пользователя

1. Клиент отправляет POST-запрос на `/api/auth/register` с данными пользователя
2. Система проверяет уникальность email и username
3. Пароль хешируется с использованием bcrypt
4. Создается новая запись в таблице `Users` с ролью "customer" по умолчанию
5. Генерируется JWT токен и возвращается клиенту

### Вход пользователя

1. Клиент отправляет POST-запрос на `/api/auth/login` с учетными данными
2. Система находит пользователя по username или email
3. Проверяется соответствие пароля хешу в базе данных
4. Если аутентификация успешна, генерируется и возвращается JWT токен

### Выход пользователя

1. Клиент отправляет POST-запрос на `/api/auth/logout`
2. Клиент удаляет токен из локального хранилища

## Реализация JWT

### Генерация токенов

Токены генерируются с использованием библиотеки `jsonwebtoken`.

```javascript
const jwt = require('jsonwebtoken');

/**
 * Генерирует JWT токен для пользователя
 * @param {Object} user - Объект пользователя
 * @returns {string} JWT токен
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  const options = {
    expiresIn: process.env.JWT_EXPIRATION || '24h'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
```

### Проверка токенов

Токены проверяются в middleware авторизации.

```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware для проверки аутентификации
 */
const auth = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Требуется аутентификация' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    
    // Добавляем пользователя в объект запроса
    req.user = user;
    
    next();
  } catch (error) {
    logger.error(`Ошибка аутентификации: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истек' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Недействительный токен' });
    }
    
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = { auth };
```

## Авторизация и контроль доступа

### Проверка ролей

Middleware для проверки ролей пользователей:

```javascript
/**
 * Middleware для проверки роли администратора
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ message: 'Доступ запрещен' });
};

/**
 * Middleware для проверки роли сотрудника (admin или manager)
 */
const staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return next();
  }
  
  return res.status(403).json({ message: 'Доступ запрещен' });
};

module.exports = { auth, adminOnly, staffOnly };
```

### Применение middleware авторизации

Пример использования middleware авторизации в маршрутах:

```javascript
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { auth, adminOnly, staffOnly } = require('../middlewares/authMiddleware');

// Публичные маршруты
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.get('/available', roomController.getAvailableRooms);

// Маршруты для сотрудников
router.get('/maintenance', auth, staffOnly, roomController.getRoomsInMaintenance);

// Маршруты только для администраторов
router.post('/', auth, adminOnly, roomController.createRoom);
router.put('/:id', auth, adminOnly, roomController.updateRoom);
router.delete('/:id', auth, adminOnly, roomController.deleteRoom);

module.exports = router;
```

## Обновление токенов

Для обеспечения длительной сессии пользователя без необходимости повторного входа используется механизм обновления токенов.

### Рефреш-токены

```javascript
/**
 * Генерирует рефреш-токен для пользователя
 * @param {Object} user - Объект пользователя
 * @returns {string} JWT рефреш-токен
 */
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    type: 'refresh'
  };
  
  const options = {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d'
  };
  
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, options);
}

/**
 * Обновляет access-токен с использованием рефреш-токена
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Рефреш-токен обязателен' });
    }
    
    // Проверяем рефреш-токен
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Недействительный тип токена' });
    }
    
    // Находим пользователя
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    
    // Генерируем новый access-токен
    const token = generateToken(user);
    
    res.json({ token });
  } catch (error) {
    logger.error(`Ошибка обновления токена: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Рефреш-токен истек' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Недействительный рефреш-токен' });
    }
    
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
```

## Защита от взлома и атак

### Ограничение частоты запросов (Rate Limiting)

Для защиты от брутфорс-атак используется middleware для ограничения частоты запросов:

```javascript
const rateLimit = require('express-rate-limit');

// Ограничение для аутентификации - 5 попыток в минуту
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 5, // максимум 5 запросов
  message: { message: 'Слишком много попыток входа. Пожалуйста, попробуйте позже.' }
});

// Применение middleware к маршрутам аутентификации
router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);
```

### CORS и заголовки безопасности

```javascript
const cors = require('cors');
const helmet = require('helmet');

// Настройка CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Защитные заголовки
app.use(helmet());
```

## Логирование событий аутентификации

Все важные события аутентификации логируются для последующего аудита:

```javascript
// Логирование успешного входа
logger.authEvent(user.id, 'login', { ip: req.ip, userAgent: req.get('User-Agent') });

// Логирование неудачной попытки входа
logger.warn(`Неудачная попытка входа: ${email}`, { ip: req.ip, userAgent: req.get('User-Agent') });

// Логирование регистрации нового пользователя
logger.authEvent(newUser.id, 'register', { ip: req.ip, userAgent: req.get('User-Agent') });
```

## Интеграция с фронтендом

### Хранение токенов на клиенте

Токены хранятся в localStorage или в защищенных cookies:

```javascript
// Сохранение токена в localStorage
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Получение токена из localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Удаление токена при выходе
function removeToken() {
  localStorage.removeItem('token');
}
```

### Автоматическая отправка токена в запросах

Для автоматической отправки токена в каждом запросе используется axios interceptor:

```javascript
import axios from 'axios';

// Создание экземпляра axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Добавление токена в заголовок каждого запроса
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ошибок аутентификации
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Если ошибка 401 и запрос не на обновление токена
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh-token', { refreshToken });
        const { token } = response.data;
        
        // Сохраняем новый токен
        localStorage.setItem('token', token);
        
        // Обновляем заголовок оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен, перенаправляем на страницу входа
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Хранение паролей

Пароли пользователей хранятся в хешированном виде с использованием bcrypt:

```javascript
const bcrypt = require('bcrypt');

// Хеширование пароля
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Проверка пароля
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

## Сброс пароля

Реализация функциональности сброса забытого пароля:

```javascript
// Запрос на сброс пароля
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Находим пользователя
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Для безопасности не сообщаем, что пользователь не найден
      return res.json({ message: 'Если указанный email существует, на него отправлена инструкция по сбросу пароля' });
    }
    
    // Генерируем токен для сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 час
    
    // Сохраняем токен и срок действия в базе данных
    await user.update({
      resetToken,
      resetTokenExpiry
    });
    
    // Отправляем email с инструкцией
    // ...
    
    res.json({ message: 'Если указанный email существует, на него отправлена инструкция по сбросу пароля' });
  } catch (error) {
    logger.error(`Ошибка при запросе сброса пароля: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Сброс пароля с использованием токена
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Находим пользователя с действительным токеном
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Недействительный или истекший токен' });
    }
    
    // Хешируем новый пароль
    const hashedPassword = await hashPassword(password);
    
    // Обновляем пароль и сбрасываем токен
    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });
    
    // Логируем событие сброса пароля
    logger.authEvent(user.id, 'password-reset');
    
    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    logger.error(`Ошибка при сбросе пароля: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
```

## Конфигурация и настройки

### Переменные окружения

Необходимые переменные окружения для системы аутентификации:

```
JWT_SECRET=your-secret-key-for-jwt
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRATION=7d
CLIENT_URL=http://localhost:3000
``` 