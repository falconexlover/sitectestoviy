# API Reference - "Лесной Дворик"

Документация API для гостиничного комплекса "Лесной Дворик". Все эндпоинты используют базовый URL: `/api`.

## Аутентификация и пользователи

### Регистрация нового пользователя
**Запрос:**
```
POST /auth/register
```

**Тело запроса:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567"
}
```

**Ответ:**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### Вход в систему
**Запрос:**
```
POST /auth/login
```

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### Получение профиля пользователя
**Запрос:**
```
GET /auth/profile
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "id": 1,
  "username": "user123",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567",
  "role": "customer",
  "createdAt": "2023-06-15T10:00:00.000Z",
  "updatedAt": "2023-06-15T10:00:00.000Z"
}
```

### Обновление профиля
**Запрос:**
```
PUT /auth/profile
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Тело запроса:**
```json
{
  "username": "newUsername",
  "firstName": "Петр",
  "lastName": "Петров",
  "phone": "+79009876543"
}
```

**Ответ:**
```json
{
  "message": "Профиль успешно обновлен",
  "user": {
    "id": 1,
    "username": "newUsername",
    "email": "user@example.com",
    "firstName": "Петр",
    "lastName": "Петров",
    "phone": "+79009876543",
    "role": "customer"
  }
}
```

### Изменение пароля
**Запрос:**
```
PUT /auth/change-password
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Тело запроса:**
```json
{
  "currentPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

**Ответ:**
```json
{
  "message": "Пароль успешно изменен"
}
```

## Номера

### Получение всех номеров
**Запрос:**
```
GET /rooms
```

**Параметры запроса:**
- `page` (необязательный): номер страницы (по умолчанию 1)
- `limit` (необязательный): количество записей на странице (по умолчанию 10)
- `sortBy` (необязательный): поле для сортировки (по умолчанию 'id')
- `order` (необязательный): порядок сортировки ('asc' или 'desc', по умолчанию 'asc')
- `type` (необязательный): фильтр по типу номера

**Ответ:**
```json
{
  "rooms": [
    {
      "id": 1,
      "name": "Стандартный номер",
      "type": "standard",
      "price": 5000,
      "capacity": 2,
      "description": "Уютный номер со всеми удобствами",
      "amenities": ["wifi", "tv", "airConditioner"],
      "images": ["room1_1.jpg", "room1_2.jpg"],
      "createdAt": "2023-06-15T10:00:00.000Z",
      "updatedAt": "2023-06-15T10:00:00.000Z"
    },
    // ...другие номера
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Получение доступных номеров
**Запрос:**
```
GET /rooms/available
```

**Параметры запроса:**
- `checkIn` (обязательный): дата заезда в формате YYYY-MM-DD
- `checkOut` (обязательный): дата выезда в формате YYYY-MM-DD
- `guests` (необязательный): количество гостей
- `type` (необязательный): тип номера

**Ответ:**
```json
{
  "rooms": [
    {
      "id": 1,
      "name": "Стандартный номер",
      "type": "standard",
      "price": 5000,
      "capacity": 2,
      "description": "Уютный номер со всеми удобствами",
      "amenities": ["wifi", "tv", "airConditioner"],
      "images": ["room1_1.jpg", "room1_2.jpg"],
      "available": true
    },
    // ...другие номера
  ]
}
```

### Получение информации о номере
**Запрос:**
```
GET /rooms/:id
```

**Ответ:**
```json
{
  "id": 1,
  "name": "Стандартный номер",
  "type": "standard",
  "price": 5000,
  "capacity": 2,
  "description": "Уютный номер со всеми удобствами",
  "amenities": ["wifi", "tv", "airConditioner"],
  "images": ["room1_1.jpg", "room1_2.jpg"],
  "createdAt": "2023-06-15T10:00:00.000Z",
  "updatedAt": "2023-06-15T10:00:00.000Z"
}
```

### Создание номера (только для админа)
**Запрос:**
```
POST /rooms
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Тело запроса:**
```json
{
  "name": "Люкс номер",
  "type": "luxe",
  "price": 10000,
  "capacity": 4,
  "description": "Роскошный номер с видом на лес",
  "amenities": ["wifi", "tv", "airConditioner", "minibar", "balcony"],
  "images": ["luxe1.jpg", "luxe2.jpg"]
}
```

**Ответ:**
```json
{
  "message": "Номер успешно создан",
  "room": {
    "id": 10,
    "name": "Люкс номер",
    "type": "luxe",
    "price": 10000,
    "capacity": 4,
    "description": "Роскошный номер с видом на лес",
    "amenities": ["wifi", "tv", "airConditioner", "minibar", "balcony"],
    "images": ["luxe1.jpg", "luxe2.jpg"],
    "createdAt": "2023-06-16T11:30:00.000Z",
    "updatedAt": "2023-06-16T11:30:00.000Z"
  }
}
```

### Обновление номера (только для админа)
**Запрос:**
```
PUT /rooms/:id
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Тело запроса:**
```json
{
  "name": "Люкс номер обновленный",
  "price": 12000,
  "description": "Обновленное описание номера"
}
```

**Ответ:**
```json
{
  "message": "Номер успешно обновлен",
  "room": {
    "id": 10,
    "name": "Люкс номер обновленный",
    "type": "luxe",
    "price": 12000,
    "capacity": 4,
    "description": "Обновленное описание номера",
    "amenities": ["wifi", "tv", "airConditioner", "minibar", "balcony"],
    "images": ["luxe1.jpg", "luxe2.jpg"],
    "updatedAt": "2023-06-16T12:00:00.000Z"
  }
}
```

### Удаление номера (только для админа)
**Запрос:**
```
DELETE /rooms/:id
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "message": "Номер успешно удален"
}
```

## Бронирования

### Создание бронирования
**Запрос:**
```
POST /bookings
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Тело запроса:**
```json
{
  "roomId": 1,
  "checkIn": "2023-07-10",
  "checkOut": "2023-07-15",
  "guests": 2,
  "comments": "Предпочтительно верхний этаж"
}
```

**Ответ:**
```json
{
  "message": "Бронирование успешно создано",
  "booking": {
    "id": 5,
    "roomId": 1,
    "UserId": 1,
    "checkIn": "2023-07-10",
    "checkOut": "2023-07-15",
    "guests": 2,
    "totalPrice": 25000,
    "status": "pending",
    "paymentStatus": "unpaid",
    "comments": "Предпочтительно верхний этаж",
    "createdAt": "2023-06-16T14:00:00.000Z",
    "updatedAt": "2023-06-16T14:00:00.000Z"
  }
}
```

### Получение бронирований пользователя
**Запрос:**
```
GET /bookings
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `status` (необязательный): фильтр по статусу бронирования
- `page` (необязательный): номер страницы
- `limit` (необязательный): количество записей на странице

**Ответ:**
```json
{
  "bookings": [
    {
      "id": 5,
      "roomId": 1,
      "checkIn": "2023-07-10",
      "checkOut": "2023-07-15",
      "guests": 2,
      "totalPrice": 25000,
      "status": "pending",
      "paymentStatus": "unpaid",
      "comments": "Предпочтительно верхний этаж",
      "createdAt": "2023-06-16T14:00:00.000Z",
      "updatedAt": "2023-06-16T14:00:00.000Z",
      "Room": {
        "id": 1,
        "name": "Стандартный номер",
        "type": "standard",
        "price": 5000,
        "images": ["room1_1.jpg"]
      }
    },
    // ...другие бронирования
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### Получение информации о бронировании
**Запрос:**
```
GET /bookings/:id
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "id": 5,
  "roomId": 1,
  "UserId": 1,
  "checkIn": "2023-07-10",
  "checkOut": "2023-07-15",
  "guests": 2,
  "totalPrice": 25000,
  "status": "pending",
  "paymentStatus": "unpaid",
  "comments": "Предпочтительно верхний этаж",
  "createdAt": "2023-06-16T14:00:00.000Z",
  "updatedAt": "2023-06-16T14:00:00.000Z",
  "Room": {
    "id": 1,
    "name": "Стандартный номер",
    "type": "standard",
    "price": 5000,
    "capacity": 2,
    "description": "Уютный номер со всеми удобствами",
    "amenities": ["wifi", "tv", "airConditioner"],
    "images": ["room1_1.jpg", "room1_2.jpg"]
  },
  "User": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "+79001234567"
  }
}
```

### Отмена бронирования
**Запрос:**
```
PUT /bookings/cancel/:id
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "message": "Бронирование успешно отменено",
  "booking": {
    "id": 5,
    "status": "cancelled",
    "updatedAt": "2023-06-16T15:00:00.000Z"
  }
}
```

### Получение всех бронирований (админ/менеджер)
**Запрос:**
```
GET /bookings/admin/all
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `status` (необязательный): фильтр по статусу
- `page` (необязательный): номер страницы
- `limit` (необязательный): количество записей на странице
- `sortBy` (необязательный): поле для сортировки
- `order` (необязательный): порядок сортировки ('asc' или 'desc')
- `search` (необязательный): поиск по имени/email пользователя

**Ответ:**
```json
{
  "bookings": [
    {
      "id": 5,
      "roomId": 1,
      "UserId": 1,
      "checkIn": "2023-07-10",
      "checkOut": "2023-07-15",
      "guests": 2,
      "totalPrice": 25000,
      "status": "pending",
      "paymentStatus": "unpaid",
      "createdAt": "2023-06-16T14:00:00.000Z",
      "Room": {
        "id": 1,
        "name": "Стандартный номер"
      },
      "User": {
        "id": 1,
        "firstName": "Иван",
        "lastName": "Иванов",
        "email": "user@example.com"
      }
    },
    // ...другие бронирования
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Изменение статуса бронирования (админ/менеджер)
**Запрос:**
```
PUT /bookings/admin/status/:id
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Тело запроса:**
```json
{
  "status": "confirmed",
  "paymentStatus": "paid",
  "adminComment": "Оплата получена, бронирование подтверждено"
}
```

**Ответ:**
```json
{
  "message": "Статус бронирования успешно обновлен",
  "booking": {
    "id": 5,
    "status": "confirmed",
    "paymentStatus": "paid",
    "adminComment": "Оплата получена, бронирование подтверждено",
    "updatedAt": "2023-06-16T16:00:00.000Z"
  }
}
```

## Клиенты (админ/менеджер)

### Получение всех клиентов
**Запрос:**
```
GET /customers
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `page` (необязательный): номер страницы
- `limit` (необязательный): количество записей на странице
- `sortBy` (необязательный): поле для сортировки
- `order` (необязательный): порядок сортировки ('asc' или 'desc')

**Ответ:**
```json
{
  "customers": [
    {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "phone": "+79001234567",
      "role": "customer",
      "createdAt": "2023-06-15T10:00:00.000Z",
      "bookingsCount": 5
    },
    // ...другие клиенты
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Поиск клиентов
**Запрос:**
```
GET /customers/search
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `query` (обязательный): строка поиска (имя, фамилия, email или телефон)

**Ответ:**
```json
{
  "customers": [
    {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "phone": "+79001234567"
    },
    // ...другие клиенты
  ]
}
```

### Получение информации о клиенте
**Запрос:**
```
GET /customers/:id
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "id": 1,
  "username": "user123",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567",
  "role": "customer",
  "createdAt": "2023-06-15T10:00:00.000Z",
  "updatedAt": "2023-06-15T10:00:00.000Z",
  "recentBookings": [
    {
      "id": 5,
      "checkIn": "2023-07-10",
      "checkOut": "2023-07-15",
      "status": "confirmed",
      "totalPrice": 25000,
      "Room": {
        "id": 1,
        "name": "Стандартный номер"
      }
    },
    // ...другие бронирования
  ]
}
```

### Получение статистики по клиенту
**Запрос:**
```
GET /customers/:id/stats
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "totalBookings": 8,
  "totalSpent": 128000,
  "favoriteRoomType": "standard",
  "averageStay": 4.5,
  "bookingsByStatus": {
    "confirmed": 5,
    "cancelled": 2,
    "completed": 1
  },
  "bookingsByMonth": {
    "2023-01": 0,
    "2023-02": 1,
    "2023-03": 0,
    "2023-04": 2,
    "2023-05": 0,
    "2023-06": 3,
    "2023-07": 2
  }
}
```

## Аналитика (админ/менеджер)

### Общая статистика
**Запрос:**
```
GET /analytics/overall
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Ответ:**
```json
{
  "totalBookings": 120,
  "totalRevenue": 1560000,
  "occupancyRate": 75.5,
  "averageStay": 3.2,
  "pendingBookings": 15,
  "confirmedBookings": 90,
  "cancelledBookings": 10,
  "completedBookings": 5,
  "totalRooms": 20,
  "totalCustomers": 85
}
```

### Статистика за период
**Запрос:**
```
GET /analytics/period
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `start` (обязательный): начало периода (YYYY-MM-DD)
- `end` (обязательный): конец периода (YYYY-MM-DD)
- `groupBy` (необязательный): группировка результатов ('day', 'week', 'month', по умолчанию 'day')

**Ответ:**
```json
{
  "start": "2023-01-01",
  "end": "2023-06-30",
  "bookings": {
    "2023-01": 18,
    "2023-02": 21,
    "2023-03": 25,
    "2023-04": 19,
    "2023-05": 22,
    "2023-06": 15
  },
  "revenue": {
    "2023-01": 234000,
    "2023-02": 273000,
    "2023-03": 325000,
    "2023-04": 247000,
    "2023-05": 286000,
    "2023-06": 195000
  },
  "occupancy": {
    "2023-01": 65.2,
    "2023-02": 75.1,
    "2023-03": 80.6,
    "2023-04": 63.4,
    "2023-05": 71.0,
    "2023-06": 50.2
  }
}
```

### Прогноз загруженности
**Запрос:**
```
GET /analytics/forecast
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `days` (необязательный): количество дней для прогноза (по умолчанию 30)

**Ответ:**
```json
{
  "forecast": [
    {
      "date": "2023-07-01",
      "occupancy": 85.0,
      "bookedRooms": 17,
      "availableRooms": 3
    },
    {
      "date": "2023-07-02",
      "occupancy": 90.0,
      "bookedRooms": 18,
      "availableRooms": 2
    },
    // ...другие даты
  ]
}
```

### Популярные номера
**Запрос:**
```
GET /analytics/popular-rooms
```

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Параметры запроса:**
- `period` (необязательный): период для анализа ('week', 'month', 'year', по умолчанию 'month')
- `limit` (необязательный): количество номеров в результате (по умолчанию 5)

**Ответ:**
```json
{
  "period": "month",
  "popularRooms": [
    {
      "id": 3,
      "name": "Люкс с видом на лес",
      "type": "luxe",
      "bookingsCount": 12,
      "revenue": 156000,
      "occupancyRate": 80.0
    },
    {
      "id": 1,
      "name": "Стандартный номер",
      "type": "standard",
      "bookingsCount": 10,
      "revenue": 50000,
      "occupancyRate": 66.7
    },
    // ...другие номера
  ]
}
``` 