# Структура проекта "Лесной Дворик"

Данный документ содержит подробное описание структуры проекта гостиничного комплекса "Лесной Дворик", включая архитектуру, компоненты и файлы.

## Обзор проекта

"Лесной Дворик" - это полноценная система управления гостиничным комплексом, которая включает:
- Веб-сайт для клиентов (бронирование номеров, управление бронированиями)
- CRM-систему для администраторов и менеджеров (управление номерами, бронированиями, клиентами)
- Аналитический модуль для бизнес-отчетности

## Технологический стек

### Backend
- Node.js с Express.js
- PostgreSQL с Sequelize ORM
- JWT для аутентификации
- Winston для логирования
- Nodemailer для отправки уведомлений

### Frontend
- React.js с React Router
- Styled Components для стилизации
- Chart.js для визуализации данных
- Context API для управления состоянием

## Структура директорий

```
/
├── backend/                 # Серверная часть приложения
│   ├── config/              # Конфигурационные файлы
│   │   └── db.js            # Конфигурация базы данных
│   ├── controllers/         # Контроллеры API
│   │   ├── analyticsController.js   # Управление аналитикой
│   │   ├── authController.js        # Аутентификация и пользователи
│   │   ├── bookingController.js     # Управление бронированиями
│   │   ├── customerController.js    # Управление клиентами
│   │   ├── paymentController.js     # Обработка платежей
│   │   └── roomController.js        # Управление номерами
│   ├── middlewares/         # Промежуточное ПО
│   │   ├── authMiddleware.js        # Аутентификация и авторизация
│   │   └── loggerMiddleware.js      # Логирование запросов и ошибок
│   ├── models/              # Модели данных (Sequelize)
│   │   ├── Booking.js       # Модель бронирования
│   │   ├── Room.js          # Модель номера
│   │   ├── User.js          # Модель пользователя
│   │   └── index.js         # Экспорт всех моделей
│   ├── routes/              # Маршруты API
│   │   ├── analyticsRoutes.js    # Маршруты аналитики
│   │   ├── authRoutes.js         # Маршруты аутентификации
│   │   ├── bookingRoutes.js      # Маршруты бронирований
│   │   ├── customerRoutes.js     # Маршруты клиентов
│   │   └── roomRoutes.js         # Маршруты номеров
│   ├── utils/               # Вспомогательные утилиты
│   │   └── logger.js        # Настройка логгера Winston
│   ├── scripts/             # Скрипты для обслуживания
│   ├── logs/                # Директория для логов
│   ├── backups/             # Директория для резервных копий
│   ├── .env                 # Переменные среды
│   ├── package.json         # Зависимости серверной части
│   └── server.js            # Точка входа серверного приложения
│
├── frontend/                # Клиентская часть приложения
│   ├── public/              # Статические файлы
│   ├── src/                 # Исходный код React
│   │   ├── assets/          # Ресурсы (изображения, шрифты и т.д.)
│   │   ├── components/      # Переиспользуемые компоненты
│   │   │   ├── Footer.js
│   │   │   ├── Gallery.js
│   │   │   ├── Header.js
│   │   │   ├── Layout.js
│   │   │   ├── PrivateRoute.js
│   │   │   ├── RoomCard.js
│   │   │   ├── Testimonials.js
│   │   │   └── index.js
│   │   ├── context/         # React контексты
│   │   │   └── AuthContext.js  # Контекст аутентификации
│   │   ├── hooks/           # Пользовательские хуки
│   │   ├── pages/           # Компоненты страниц
│   │   │   ├── admin/           # Страницы админ-панели
│   │   │   │   ├── AnalyticsPage.js
│   │   │   │   ├── BookingsPage.js
│   │   │   │   ├── CustomerDetailPage.js
│   │   │   │   ├── CustomersPage.js
│   │   │   │   ├── DashboardPage.js
│   │   │   │   └── RoomsPage.js
│   │   │   ├── AboutPage.js
│   │   │   ├── BookingDetailPage.js
│   │   │   ├── BookingPage.js
│   │   │   ├── BookingsPage.js
│   │   │   ├── ContactPage.js
│   │   │   ├── GalleryPage.js
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── NotFoundPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── RoomDetailPage.js
│   │   │   ├── RoomsPage.js
│   │   │   └── ServicePage.js
│   │   ├── services/        # Сервисы для взаимодействия с API
│   │   │   ├── analyticsService.js
│   │   │   ├── api.js
│   │   │   ├── bookingService.js
│   │   │   ├── roomService.js
│   │   │   └── userService.js
│   │   ├── utils/           # Вспомогательные функции
│   │   ├── App.js           # Корневой компонент приложения
│   │   ├── index.js         # Точка входа React приложения
│   │   └── index.css        # Глобальные стили
│   ├── package.json         # Зависимости клиентской части
│   └── build/               # Готовый к развертыванию код
│
├── README.md                # Основной файл документации
├── IMPLEMENTATION_GUIDE.md  # Руководство по реализации
├── TODO.md                  # Список задач для выполнения
└── инструкция_запуска_linux.txt  # Инструкции по установке и запуску
```

## Основные компоненты и их взаимодействие

### Аутентификация и авторизация
- **Контроллер:** `backend/controllers/authController.js`
- **Middleware:** `backend/middlewares/authMiddleware.js`
- **Маршруты:** `backend/routes/authRoutes.js`
- **Фронтенд:** `frontend/src/context/AuthContext.js`, `frontend/src/pages/LoginPage.js`, `frontend/src/pages/RegisterPage.js`

### Управление номерами
- **Контроллер:** `backend/controllers/roomController.js`
- **Модель:** `backend/models/Room.js`
- **Маршруты:** `backend/routes/roomRoutes.js`
- **Фронтенд:** `frontend/src/pages/RoomsPage.js`, `frontend/src/pages/RoomDetailPage.js`, `frontend/src/pages/admin/RoomsPage.js`

### Бронирование
- **Контроллер:** `backend/controllers/bookingController.js`
- **Модель:** `backend/models/Booking.js`
- **Маршруты:** `backend/routes/bookingRoutes.js`
- **Фронтенд:** `frontend/src/pages/BookingPage.js`, `frontend/src/pages/BookingsPage.js`, `frontend/src/pages/admin/BookingsPage.js`

### Аналитика
- **Контроллер:** `backend/controllers/analyticsController.js`
- **Маршруты:** `backend/routes/analyticsRoutes.js`
- **Фронтенд:** `frontend/src/pages/admin/AnalyticsPage.js`, `frontend/src/pages/admin/DashboardPage.js`

### Клиенты
- **Контроллер:** `backend/controllers/customerController.js`
- **Маршруты:** `backend/routes/customerRoutes.js`
- **Фронтенд:** `frontend/src/pages/admin/CustomersPage.js`, `frontend/src/pages/admin/CustomerDetailPage.js`

### Платежи
- **Контроллер:** `backend/controllers/paymentController.js`
- **Фронтенд:** Компонент формы оплаты (в разработке)

## Уровни доступа

1. **Гость (неаутентифицированный пользователь)**
   - Просмотр информации о номерах
   - Регистрация и вход в систему

2. **Клиент (аутентифицированный пользователь)**
   - Все права гостя
   - Бронирование номеров
   - Просмотр и управление своими бронированиями
   - Управление профилем

3. **Менеджер (role: 'manager')**
   - Все права клиента
   - Просмотр всех бронирований
   - Изменение статуса бронирований
   - Просмотр информации о клиентах
   - Доступ к базовой аналитике

4. **Администратор (role: 'admin')**
   - Все права менеджера
   - Управление номерами (добавление, редактирование, удаление)
   - Полный доступ к аналитике
   - Управление пользователями

## API эндпоинты

### Аутентификация
- POST `/api/auth/register` - регистрация пользователя
- POST `/api/auth/login` - аутентификация пользователя
- GET `/api/auth/profile` - получение профиля пользователя
- PUT `/api/auth/profile` - обновление профиля
- PUT `/api/auth/change-password` - изменение пароля

### Номера
- GET `/api/rooms` - получение всех номеров
- GET `/api/rooms/:id` - получение информации о номере
- GET `/api/rooms/available` - получение доступных номеров на даты
- POST `/api/rooms` - создание номера (только админ)
- PUT `/api/rooms/:id` - обновление номера (только админ)
- DELETE `/api/rooms/:id` - удаление номера (только админ)

### Бронирования
- POST `/api/bookings` - создание бронирования
- GET `/api/bookings` - получение бронирований пользователя
- GET `/api/bookings/:id` - получение информации о бронировании
- PUT `/api/bookings/cancel/:id` - отмена бронирования
- GET `/api/bookings/admin/all` - получение всех бронирований (админ/менеджер)
- PUT `/api/bookings/admin/status/:id` - изменение статуса бронирования (админ/менеджер)

### Клиенты (админ/менеджер)
- GET `/api/customers` - получение всех клиентов
- GET `/api/customers/:id` - получение информации о клиенте
- GET `/api/customers/search` - поиск клиентов
- GET `/api/customers/:id/stats` - статистика по клиенту

### Аналитика (админ/менеджер)
- GET `/api/analytics/overall` - общая статистика
- GET `/api/analytics/period` - статистика за период
- GET `/api/analytics/forecast` - прогноз загруженности
- GET `/api/analytics/popular-rooms` - популярные номера 