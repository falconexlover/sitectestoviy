# Гостиничный комплекс "Лесной Дворик"

Полнофункциональное веб-приложение для управления бронированиями и информацией о номерах гостиничного комплекса.

## Структура проекта

Проект разделен на две основные части:

- **frontend/** - клиентская часть на React
- **backend/** - серверная часть на Express.js

## Технологии

### Фронтенд
- React 18+
- React Router 6
- Tailwind CSS
- Chart.js для аналитики
- Formik и Yup для валидации форм
- Axios для HTTP запросов
- React Icons

### Бэкенд
- Node.js с Express
- PostgreSQL (production) / SQLite (development)
- Sequelize ORM
- JWT для аутентификации
- Swagger для документации API
- Winston для логирования
- i18next для интернационализации

## Начало работы

### Предварительные требования

- Node.js 14+ и npm 7+
- PostgreSQL (для production)

### Установка и запуск

1. **Клонирование репозитория**

```bash
git clone https://github.com/falconexlover/sitectestoviy.git
cd lesnoy-dvorik
```

2. **Установка зависимостей**

```bash
npm run install:all
```

3. **Настройка переменных окружения**

```bash
npm run init:env
```

Отредактируйте созданные файлы `.env` в директориях `frontend/` и `backend/` с вашими настройками.

4. **Запуск в режиме разработки**

```bash
npm run dev
```

Это запустит и фронтенд (порт 3000), и бэкенд (порт 5000) одновременно.

## Деплой на Vercel

Для деплоя проекта на Vercel следуйте инструкциям в [DEPLOY.md](./DEPLOY.md).

## API Документация

После запуска бэкенда, Swagger документация API доступна по адресу:
http://localhost:5000/api-docs

## Тестирование

```bash
npm run test
```

## Структура директорий

```
/
├── frontend/                 # React фронтенд
│   ├── public/               # Статические файлы
│   └── src/                  # Исходный код React
│       ├── assets/           # Изображения, шрифты и т.д.
│       ├── components/       # Многоразовые компоненты
│       ├── context/          # React контексты
│       ├── hooks/            # Пользовательские хуки
│       ├── pages/            # Страницы приложения
│       ├── services/         # Сервисы для API запросов
│       └── utils/            # Вспомогательные функции
├── backend/                  # Node.js бэкенд
│   ├── config/               # Конфигурация приложения
│   ├── controllers/          # Контроллеры для обработки запросов
│   ├── middlewares/          # Middleware функции
│   ├── models/               # Sequelize модели
│   ├── routes/               # Маршруты Express
│   └── utils/                # Вспомогательные функции
└── deploy.sh                 # Скрипт для автоматизации деплоя
```

## Лицензия

Этот проект лицензирован под ISC лицензией. 