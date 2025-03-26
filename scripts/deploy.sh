#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Начинаю подготовку к деплою на Vercel...${NC}"

# Проверяем наличие Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo -e "${RED}Vercel CLI не найден. Устанавливаем...${NC}"
    npm install -g vercel
fi

# Проверка аутентификации в Vercel
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Необходимо войти в аккаунт Vercel${NC}"
    vercel login
fi

# Проверка файла .env
if [ ! -f "./backend/.env" ]; then
    echo -e "${YELLOW}Не найден файл backend/.env. Создаем из примера...${NC}"
    cp ./backend/.env.example ./backend/.env
    echo -e "${RED}⚠️ Важно: Отредактируйте backend/.env с вашими настройками перед деплоем!${NC}"
    sleep 2
fi

if [ ! -f "./frontend/.env" ]; then
    echo -e "${YELLOW}Не найден файл frontend/.env. Создаем из примера...${NC}"
    cp ./frontend/.env.example ./frontend/.env
    echo -e "${RED}⚠️ Важно: Отредактируйте frontend/.env с вашими настройками перед деплоем!${NC}"
    sleep 2
fi

echo -e "${BLUE}Сохраняем изменения в Git...${NC}"
git add .
git diff-index --quiet HEAD || git commit -m "Подготовка к деплою на Vercel"
git push

# Деплой бэкенда
echo -e "${BLUE}Деплой бэкенда...${NC}"
cd backend
echo -e "${GREEN}Устанавливаем зависимости бэкенда...${NC}"
npm install

echo -e "${GREEN}Деплой бэкенда на Vercel...${NC}"
vercel --prod

# Запоминаем URL бэкенда
BACKEND_URL=$(vercel ls -j | grep -o '"url":"[^"]*"' | head -1 | sed 's/"url":"//;s/"//')

# Деплой фронтенда
echo -e "${BLUE}Деплой фронтенда...${NC}"
cd ../frontend
echo -e "${GREEN}Устанавливаем зависимости фронтенда...${NC}"
npm install

echo -e "${GREEN}Обновляем API URL для фронтенда...${NC}"
sed -i "s|REACT_APP_API_URL=.*|REACT_APP_API_URL=${BACKEND_URL}/api/v1|g" .env.production

echo -e "${GREEN}Деплой фронтенда на Vercel...${NC}"
vercel --prod

cd ..
echo -e "${GREEN}Деплой завершен!${NC}"
echo -e "${BLUE}Не забудьте проверить работу приложения.${NC}"
echo -e "${YELLOW}Бэкенд URL: ${BACKEND_URL}${NC}" 