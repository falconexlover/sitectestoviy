# Деплой проекта "Лесной Дворик" на Vercel

Данный документ содержит инструкции по деплою фронтенда и бэкенда на платформу Vercel.

## Перед началом

1. Убедитесь, что у вас есть аккаунт на [Vercel](https://vercel.com)
2. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Авторизуйтесь в Vercel CLI:
   ```bash
   vercel login
   ```
4. Убедитесь, что у вас есть база данных PostgreSQL. Рекомендуем использовать:
   - [Neon](https://neon.tech) (бесплатный тариф)
   - [Supabase](https://supabase.com) (бесплатный тариф)
   - [ElephantSQL](https://www.elephantsql.com) (бесплатный тариф)

## Структура проекта

```
/
├── backend/           # Бэкенд на Express.js
├── frontend/          # Фронтенд на React
├── deploy.sh          # Скрипт для автоматизации деплоя
└── package.json       # Корневой package.json
```

## Настройка переменных окружения

### Бэкенд (.env.production)

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://lesnoy-dvorik.vercel.app
API_URL=https://lesnoy-dvorik-backend.vercel.app
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=your_strong_secret_key
JWT_EXPIRE=30d
LOG_LEVEL=error
```

### Фронтенд (.env.production)

```
REACT_APP_API_URL=https://lesnoy-dvorik-backend.vercel.app/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

## Деплой бэкенда

### Вариант 1: Через Vercel Dashboard

1. Зайдите на [vercel.com](https://vercel.com) и авторизуйтесь
2. Нажмите "Add New..." → "Project"
3. Импортируйте репозиторий с GitHub
4. В настройках проекта:
   - Название проекта: "lesnoy-dvorik-backend"
   - Framework preset: выберите "Other"
   - Root directory: выберите "backend"
   - Environment Variables: добавьте переменные из .env.production
   - Нажмите "Deploy"

### Вариант 2: Через командную строку

```bash
cd backend
vercel --prod
```

## Деплой фронтенда

### Вариант 1: Через Vercel Dashboard

1. Зайдите на [vercel.com](https://vercel.com) и авторизуйтесь
2. Нажмите "Add New..." → "Project"
3. Импортируйте репозиторий с GitHub
4. В настройках проекта:
   - Название проекта: "lesnoy-dvorik"
   - Framework preset: выберите "Create React App"
   - Root directory: выберите "frontend"
   - Environment Variables: добавьте переменные из .env.production
   - Нажмите "Deploy"

### Вариант 2: Через командную строку

```bash
cd frontend
vercel --prod
```

## Деплой обоих частей одновременно

Для удобства деплоя обеих частей приложения одновременно, используйте скрипт `deploy.sh`:

```bash
./deploy.sh
```

## Проверка деплоя

После успешного деплоя:

1. Фронтенд будет доступен по адресу: `https://lesnoy-dvorik.vercel.app`
2. Бэкенд будет доступен по адресу: `https://lesnoy-dvorik-backend.vercel.app`
3. API бэкенда будет доступен по адресу: `https://lesnoy-dvorik-backend.vercel.app/api`
4. Документация API: `https://lesnoy-dvorik-backend.vercel.app/api-docs`

## Устранение неполадок

1. **Проблема с CORS**: Убедитесь, что в `vercel.json` корректно указаны CORS-заголовки
2. **База данных не подключается**: Проверьте переменную `DATABASE_URL` в настройках проекта на Vercel
3. **Ошибки при сборке фронтенда**: Проверьте логи сборки на Vercel Dashboard
4. **API не отвечает**: Убедитесь, что серверлесс-функции правильно настроены в `vercel.json`

Для дополнительной информации по деплою на Vercel, обратитесь к [официальной документации Vercel](https://vercel.com/docs).
