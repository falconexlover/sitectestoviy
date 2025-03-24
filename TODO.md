# Список оставшихся задач для проекта "Лесной Дворик"

## 1. Добавление стилей (Tailwind CSS)

### Установка и настройка
```bash
cd frontend
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Создание файла конфигурации
Создайте файл `frontend/tailwind.config.js`:
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#ffd700',
        light: '#f5f5f5',
        dark: '#333333'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    }
  },
  plugins: []
}
```

### Обновление файла стилей
Обновите `frontend/src/index.css`, добавив в начало директивы Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Существующие стили оставьте ниже */
```

### Применение к компонентам
Пример применения классов Tailwind к компоненту:
```jsx
<button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
  Забронировать
</button>
```

## 2. Интеграция платежей через Stripe

### Установка зависимостей
```bash
# Backend
cd backend
npm install stripe

# Frontend
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Настройка переменных окружения
Добавьте в `backend/.env`:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### Создание контроллера платежей
Создайте файл `backend/controllers/paymentController.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Booking } = require('../models');
const logger = require('../utils/logger');

// Создание платежного намерения
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ message: 'Идентификатор бронирования обязателен' });
    }
    
    // Получаем бронирование
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Бронирование уже оплачено' });
    }
    
    // Создаем платежное намерение в Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Конвертируем в копейки/центы
      currency: 'rub',
      metadata: {
        bookingId: booking.id.toString(),
        userId: req.user.id.toString()
      }
    });
    
    // Возвращаем клиентский секрет
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalPrice
    });
  } catch (err) {
    logger.error(`Ошибка при создании платежного намерения: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Обработка успешной оплаты
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Проверяем статус платежа в Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Платеж не завершен' });
    }
    
    const bookingId = paymentIntent.metadata.bookingId;
    
    // Обновляем статус оплаты в бронировании
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }
    
    await booking.update({
      paymentStatus: 'paid',
      paymentMethod: 'card'
    });
    
    res.json({ message: 'Оплата успешно завершена', booking });
  } catch (err) {
    logger.error(`Ошибка при обработке успешного платежа: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Получение информации о статусе оплаты
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }
    
    // Проверяем, что пользователь имеет право на просмотр
    if (booking.UserId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    res.json({
      bookingId: booking.id,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus
    });
  } catch (err) {
    logger.error(`Ошибка при получении статуса оплаты: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
```

### Создание маршрутов для платежей
Создайте файл `backend/routes/paymentRoutes.js`:
```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middlewares/authMiddleware');

// Маршруты для платежей
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);
router.post('/payment-success', auth, paymentController.handlePaymentSuccess);
router.get('/status/:bookingId', auth, paymentController.getPaymentStatus);

module.exports = router;
```

### Подключение маршрутов в сервере
Обновите `backend/server.js`, добавив:
```javascript
const paymentRoutes = require('./routes/paymentRoutes');
// ...
app.use('/api/payments', paymentRoutes);
```

### Создание компонента для оплаты на фронтенде
Создайте файл `frontend/src/components/PaymentForm.js`:
```jsx
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { bookingService } from '../services/api';

const PaymentContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const CardElementContainer = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const PaymentForm = ({ bookingId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Создаем Payment Intent при загрузке компонента
    const createPaymentIntent = async () => {
      try {
        const response = await bookingService.createPaymentIntent(bookingId);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError('Не удалось инициировать платеж. Пожалуйста, попробуйте позже.');
        console.error('Ошибка при создании Payment Intent:', err);
      }
    };

    if (bookingId) {
      createPaymentIntent();
    }
  }, [bookingId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message || 'Ошибка при обработке платежа');
      } else if (result.paymentIntent.status === 'succeeded') {
        // Сообщаем серверу об успешной оплате
        await bookingService.handlePaymentSuccess(result.paymentIntent.id);
        
        // Вызываем обработчик успешной оплаты
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setError('Произошла ошибка при обработке платежа');
      console.error('Ошибка при обработке платежа:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PaymentContainer>
      <h2>Оплата бронирования</h2>
      <p>Сумма к оплате: {amount} ₽</p>
      
      <form onSubmit={handleSubmit}>
        <CardElementContainer>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </CardElementContainer>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          style={{
            backgroundColor: '#003366',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            opacity: (!stripe || processing || !clientSecret) ? 0.7 : 1
          }}
        >
          {processing ? 'Обработка...' : 'Оплатить'}
        </button>
      </form>
    </PaymentContainer>
  );
};

export default PaymentForm;
```

### Обновление сервиса API
Добавьте в `frontend/src/services/api.js`:
```javascript
const paymentService = {
  createPaymentIntent: (bookingId) => api.post('/payments/create-payment-intent', { bookingId }),
  handlePaymentSuccess: (paymentIntentId) => api.post('/payments/payment-success', { paymentIntentId }),
  getPaymentStatus: (bookingId) => api.get(`/payments/status/${bookingId}`)
};

export {
  // ...другие экспорты
  paymentService
};
```

### Подключение Stripe в приложении
Обновите `frontend/src/App.js`, добавив провайдер Stripe:
```jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          {/* Существующий код */}
        </Router>
      </Elements>
    </AuthProvider>
  );
}
```

## 3. Добавление логирования с Winston

### Установка зависимостей
```bash
cd backend
npm install winston
```

### Создание утилиты логирования
Создайте директорию `backend/logs` для хранения логов:
```bash
mkdir -p backend/logs
```

Создайте файл `backend/utils/logger.js`:
```javascript
const winston = require('winston');
const path = require('path');

// Определение форматов логирования
const formats = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Настройка транспортов
const transports = [
  // Запись критических ошибок в отдельный файл
  new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/error.log'), 
    level: 'error' 
  }),
  // Запись всех логов уровня info и выше
  new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/combined.log') 
  })
];

// В режиме разработки выводим логи в консоль
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// Создание экземпляра логгера
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: formats,
  transports
});

// Создание обработчика для HTTP-запросов
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
```

### Промежуточное ПО для логирования
Создайте файл `backend/middlewares/loggerMiddleware.js`:
```javascript
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    body: req.method === 'POST' || req.method === 'PUT' ? '[BODY]' : undefined,
    query: Object.keys(req.query).length ? req.query : undefined,
    ip: req.ip,
    userId: req.user ? req.user.id : undefined
  });
  
  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.user ? req.user.id : undefined
  });
  
  next(err);
};

module.exports = {
  requestLogger,
  errorLogger
};
```

### Интеграция логгера в сервер
Обновите `backend/server.js`, добавив:
```javascript
const { requestLogger, errorLogger } = require('./middlewares/loggerMiddleware');
const logger = require('./utils/logger');

// ... (существующий код)

// Добавьте логирование запросов перед маршрутами
app.use(requestLogger);

// ... маршруты

// Добавьте логирование ошибок после маршрутов, но перед обработчиком ошибок
app.use(errorLogger);

// Обновите обработчик ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
```

### Использование логгера в контроллерах
Пример использования в контроллере:
```javascript
const logger = require('../utils/logger');

try {
  // Ваш код
  logger.info(`Пользователь ${req.user.id} успешно выполнил действие`);
} catch (err) {
  logger.error(`Ошибка при выполнении действия: ${err.message}`);
  res.status(500).json({ message: err.message });
}
```

## 4. Документация API с Swagger

### Установка зависимостей
```bash
cd backend
npm install swagger-jsdoc swagger-ui-express
```

### Настройка Swagger в сервере
Обновите `backend/server.js`, добавив:
```javascript
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Конфигурация Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API гостиничного комплекса "Лесной Дворик"',
      version: '1.0.0',
      description: 'API для управления бронированиями, номерами и клиентами'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Сервер разработки'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
```

### Аннотирование маршрутов
Пример для `backend/routes/authRoutes.js`:
```javascript
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API для аутентификации и управления профилем
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка в запросе
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/login', authController.login);
```

Пример для моделей (`backend/models/User.js`):
```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         firstName:
 *           type: string
 *           description: Имя пользователя
 *         lastName:
 *           type: string
 *           description: Фамилия пользователя
 *         phone:
 *           type: string
 *           description: Телефон пользователя
 *         role:
 *           type: string
 *           enum: [customer, admin, manager]
 *           description: Роль пользователя
 */
```

## 5. Резервное копирование базы данных

### Создание скрипта для бэкапа
Создайте файл `backend/scripts/backup.sh`:
```bash
#!/bin/bash

# Загрузка переменных из .env файла
source "$(dirname "$0")/../.env"

# Создание директории для бэкапов, если она не существует
BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"

# Формирование имени файла с датой и временем
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Создание бэкапа
echo "Создание бэкапа базы данных $DB_NAME..."
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > "$BACKUP_FILE"

# Проверка результата
if [ $? -eq 0 ]; then
  echo "Бэкап успешно создан: $BACKUP_FILE"
  
  # Сжатие файла для экономии места
  gzip "$BACKUP_FILE"
  echo "Файл бэкапа сжат: $BACKUP_FILE.gz"
  
  # Удаление старых бэкапов (оставляем только последние 10)
  find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | sort -r | tail -n +11 | xargs -r rm
  echo "Старые бэкапы удалены. Оставлены только последние 10 файлов."
else
  echo "Ошибка при создании бэкапа!"
  exit 1
fi
```

### Настройка прав на выполнение скрипта
```bash
chmod +x backend/scripts/backup.sh
```

### Создание скрипта для восстановления из бэкапа
Создайте файл `backend/scripts/restore.sh`:
```bash
#!/bin/bash

# Загрузка переменных из .env файла
source "$(dirname "$0")/../.env"

# Проверка, указан ли файл бэкапа
if [ -z "$1" ]; then
  echo "Не указан файл бэкапа!"
  echo "Использование: $0 <путь_к_файлу_бэкапа>"
  exit 1
fi

BACKUP_FILE="$1"

# Проверка существования файла
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Файл бэкапа не найден: $BACKUP_FILE"
  exit 1
fi

# Распаковка, если файл сжат
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "Распаковка файла бэкапа..."
  gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
  BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Восстановление базы данных
echo "Восстановление базы данных $DB_NAME из файла $BACKUP_FILE..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME < "$BACKUP_FILE"

# Проверка результата
if [ $? -eq 0 ]; then
  echo "База данных успешно восстановлена из файла: $BACKUP_FILE"
else
  echo "Ошибка при восстановлении базы данных!"
  exit 1
fi
```

### Настройка прав на выполнение скрипта
```bash
chmod +x backend/scripts/restore.sh
```

### Настройка автоматического запуска через cron
Добавьте в crontab (запуск от имени пользователя):
```
# Ежедневный бэкап в 2:00 утра
0 2 * * * /path/to/backend/scripts/backup.sh >> /path/to/backend/logs/backup.log 2>&1
```

### Документирование процедур бэкапа и восстановления
Добавьте раздел в README.md:
```markdown
## Резервное копирование базы данных

### Автоматический бэкап
Система настроена на ежедневное создание бэкапов базы данных в 2:00 утра. Файлы бэкапов хранятся в директории `backend/backups` в формате `backup_YYYY-MM-DD_HH-MM-SS.sql.gz`. Система автоматически удаляет старые бэкапы, оставляя только 10 последних.

### Ручной запуск бэкапа
Для ручного создания бэкапа выполните:
```bash
cd backend
./scripts/backup.sh
```

### Восстановление из бэкапа
Для восстановления базы данных из бэкапа выполните:
```bash
cd backend
./scripts/restore.sh backups/backup_YYYY-MM-DD_HH-MM-SS.sql.gz
```
``` 