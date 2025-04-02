# Бэкенд для сайта "Лесной дворик"

Бэкенд-сервер для сайта гостиницы "Лесной дворик" с API для управления контентом.

## Требования

- Node.js 16+
- MongoDB (локальная или MongoDB Atlas)

## Установка

1. Клонируйте репозиторий:
```
git clone <ваш-репозиторий>
cd <путь-к-проекту>/backend
```

2. Установите зависимости:
```
npm install
```

3. Настройте переменные окружения:
   - Переименуйте файл `.env.example` в `.env`
   - Отредактируйте значения в файле `.env`:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/lesnoydvorik
     JWT_SECRET=ваш_секретный_ключ
     JWT_EXPIRES_IN=24h
     ADMIN_LOGIN=admin
     ADMIN_PASSWORD=ваш_надежный_пароль
     API_URL=http://localhost:5000
     FRONTEND_URL=http://localhost:3000
     ```

## Запуск

### Режим разработки
```
npm run dev
```

### Сборка и запуск в продакшн-режиме
```
npm run build
npm start
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход администратора

### Галерея
- `GET /api/gallery` - Получить все изображения галереи
- `GET /api/gallery/:id` - Получить изображение по ID
- `POST /api/gallery` - Загрузить новое изображение (требует аутентификации)
- `PUT /api/gallery/:id` - Обновить информацию об изображении (требует аутентификации)
- `DELETE /api/gallery/:id` - Удалить изображение (требует аутентификации)

### Номера
- `GET /api/rooms` - Получить все номера
- `GET /api/rooms/:id` - Получить номер по ID
- `POST /api/rooms` - Создать новый номер (требует аутентификации)
- `PUT /api/rooms/:id` - Обновить информацию о номере (требует аутентификации)
- `DELETE /api/rooms/:id` - Удалить номер (требует аутентификации)

### Главная страница
- `GET /api/homepage` - Получить контент главной страницы
- `PUT /api/homepage/section/:section` - Обновить секцию главной страницы (требует аутентификации)
- `POST /api/homepage/image` - Загрузить изображение для главной страницы (требует аутентификации)

## Примеры запросов

### Вход администратора:
```
POST /api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "ваш_пароль"
}
```

### Загрузка изображения в галерею:
```
POST /api/gallery
Authorization: Bearer ваш_токен
Content-Type: multipart/form-data

image: [файл изображения]
title: "Название изображения"
description: "Описание изображения"
category: "rooms"
```

## Деплой на хостинг

### Настройка на VPS (Ubuntu/Debian)

1. Установите Node.js, MongoDB и pm2:
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb
sudo npm install -g pm2
```

2. Клонируйте репозиторий:
```
git clone <ваш-репозиторий>
cd <путь-к-проекту>/backend
```

3. Установите зависимости и соберите проект:
```
npm install
npm run build
```

4. Настройте .env файл для продакшена.

5. Запустите сервер с помощью pm2:
```
pm2 start dist/index.js --name "lesnoydvorik-backend"
pm2 save
pm2 startup
```

### Настройка на хостингах с поддержкой Node.js (Heroku, Vercel, Railway и т.д.)

1. Следуйте документации вашего хостинг-провайдера для деплоя Node.js приложений.
2. Настройте переменные окружения в панели управления хостингом.
3. Убедитесь, что у вас есть подключение к MongoDB (можно использовать MongoDB Atlas). 