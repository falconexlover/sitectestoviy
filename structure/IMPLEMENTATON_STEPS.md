# План реализации оставшихся задач проекта "Лесной Дворик"

Этот документ содержит поэтапный план выполнения задач, которые осталось реализовать в проекте гостиничного комплекса "Лесной Дворик".

## Приоритизация задач

Рекомендуемый порядок выполнения задач:

1. **Система логирования с Winston** - ✅ Выполнено
2. **Документация API с Swagger**
3. **Добавление стилей с Tailwind CSS**
4. **Резервное копирование базы данных**
5. **Интеграция платежей через Stripe**

## 1. Документация API с Swagger

### Задачи:
- [x] Установка пакетов swagger-jsdoc и swagger-ui-express
- [ ] Настройка Swagger в server.js
- [ ] Документирование маршрутов API (auth, rooms, bookings, customers, analytics)
- [ ] Документирование моделей данных
- [ ] Тестирование документации

### Шаги реализации:

1. **Установка зависимостей**
   ```bash
   cd backend
   npm install swagger-jsdoc swagger-ui-express
   ```

2. **Настройка Swagger в сервере**
   Добавить в `server.js`:
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

3. **Документирование маршрутов API**
   - Начать с базовых маршрутов аутентификации
   - Документировать маршруты номеров
   - Добавить документацию для бронирований
   - Документировать маршруты для работы с клиентами
   - Добавить документацию для аналитики

4. **Пример документирования маршрута аутентификации**
   В файле `backend/routes/authRoutes.js` добавить:
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
   ```

5. **Документирование моделей данных**
   В файле `backend/models/User.js` добавить:
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

6. **Тестирование документации**
   - Запустить сервер
   - Открыть `/api-docs` в браузере
   - Проверить корректность отображения всех эндпоинтов
   - Протестировать выполнение запросов через интерфейс Swagger

## 2. Добавление стилей с Tailwind CSS

### Задачи:
- [ ] Установка Tailwind CSS, PostCSS и Autoprefixer
- [ ] Настройка конфигурации Tailwind
- [ ] Интеграция Tailwind в проект
- [ ] Применение стилей к компонентам
- [ ] Оптимизация стилей для продакшн

### Шаги реализации:

1. **Установка зависимостей**
   ```bash
   cd frontend
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Настройка конфигурации Tailwind**
   Создать или обновить файл `frontend/tailwind.config.js`:
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

3. **Интеграция Tailwind в проект**
   Обновить `frontend/src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* Существующие стили оставить ниже */
   ```

4. **Применение стилей к компонентам**
   Пример применения в компоненте:
   ```jsx
   // До применения Tailwind
   <button className="booking-button">Забронировать</button>

   // После применения Tailwind
   <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
     Забронировать
   </button>
   ```

5. **Обновление основных компонентов**
   - Обновить Header.js
   - Обновить Footer.js
   - Обновить Layout.js
   - Обновить компоненты страниц

6. **Оптимизация для продакшн**
   В `package.json` добавить скрипт:
   ```json
   "build:css": "tailwindcss build src/index.css -o src/tailwind.output.css --minify"
   ```

## 3. Резервное копирование базы данных

### Задачи:
- [ ] Создание скриптов для резервного копирования
- [ ] Создание скриптов для восстановления из бэкапа
- [ ] Настройка автоматического резервного копирования
- [ ] Документирование процедур бэкапа

### Шаги реализации:

1. **Создание директории для бэкапов**
   ```bash
   mkdir -p backend/backups
   ```

2. **Создание скрипта для бэкапа**
   Создать файл `backend/scripts/backup.sh`:
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

3. **Создание скрипта для восстановления**
   Создать файл `backend/scripts/restore.sh`:
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

4. **Настройка прав на выполнение**
   ```bash
   chmod +x backend/scripts/backup.sh
   chmod +x backend/scripts/restore.sh
   ```

5. **Настройка автоматического запуска через cron**
   Добавить в crontab:
   ```
   # Ежедневный бэкап в 2:00 утра
   0 2 * * * /path/to/backend/scripts/backup.sh >> /path/to/backend/logs/backup.log 2>&1
   ```

6. **Документирование процедур**
   Добавить в README.md раздел:
   ```markdown
   ## Резервное копирование базы данных

   ### Автоматический бэкап
   Система настроена на ежедневное создание бэкапов базы данных в 2:00 утра. Файлы бэкапов хранятся в директории `backend/backups` в формате `backup_YYYY-MM-DD_HH-MM-SS.sql.gz`. Система автоматически удаляет старые бэкапы, оставляя только последние 10.

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

## 4. Интеграция платежей через Stripe

### Задачи:
- [ ] Регистрация и получение API-ключей Stripe
- [ ] Установка библиотек Stripe
- [ ] Реализация бэкенд-контроллера для обработки платежей
- [ ] Создание маршрутов платежей
- [ ] Реализация компонента для оплаты на фронтенде
- [ ] Интеграция платежей в процесс бронирования
- [ ] Тестирование с использованием тестовых карт

### Шаги реализации:

1. **Регистрация и получение API-ключей**
   - Зарегистрироваться на Stripe (https://stripe.com)
   - Получить API-ключи (тестовые и боевые)
   - Добавить ключи в .env:
     ```
     STRIPE_SECRET_KEY=sk_test_your_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_key
     ```

2. **Установка библиотек**
   ```bash
   # Backend
   cd backend
   npm install stripe

   # Frontend
   cd frontend
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

3. **Реализация бэкенд-контроллера**
   Создать файл `backend/controllers/paymentController.js`:
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

4. **Создание маршрутов платежей**
   Создать файл `backend/routes/paymentRoutes.js`:
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

5. **Подключение маршрутов в сервере**
   Обновить `backend/server.js`:
   ```javascript
   const paymentRoutes = require('./routes/paymentRoutes');
   // ...
   app.use('/api/payments', paymentRoutes);
   ```

6. **Реализация компонента оплаты на фронтенде**
   Создать файл `frontend/src/components/PaymentForm.js`:
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

7. **Обновление API-сервиса**
   Добавить в `frontend/src/services/api.js`:
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

8. **Интеграция Stripe в приложение**
   Обновить `frontend/src/App.js`:
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

9. **Добавление компонента оплаты на страницу**
   На странице деталей бронирования `frontend/src/pages/BookingDetailPage.js`:
   ```jsx
   import PaymentForm from '../components/PaymentForm';

   // ... в компоненте
   {booking.paymentStatus === 'unpaid' && (
     <PaymentForm 
       bookingId={booking.id} 
       amount={booking.totalPrice} 
       onSuccess={() => {
         // Обновление данных бронирования после оплаты
         fetchBookingDetails();
       }} 
     />
   )}
   ``` 