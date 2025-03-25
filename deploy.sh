#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Начинаю подготовку к деплою на Vercel...${NC}"

# Проверяем наличие Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo -e "${RED}Vercel CLI не найден. Устанавливаем...${NC}"
    npm install -g vercel
fi

# Деплой бэкенда
echo -e "${BLUE}Деплой бэкенда...${NC}"
cd backend
echo -e "${GREEN}Устанавливаем зависимости бэкенда...${NC}"
npm install

echo -e "${GREEN}Деплой бэкенда на Vercel...${NC}"
vercel --prod

# Деплой фронтенда
echo -e "${BLUE}Деплой фронтенда...${NC}"
cd ../frontend
echo -e "${GREEN}Устанавливаем зависимости фронтенда...${NC}"
npm install

echo -e "${GREEN}Деплой фронтенда на Vercel...${NC}"
vercel --prod

cd ..
echo -e "${GREEN}Деплой завершен!${NC}"
echo -e "${BLUE}Не забудьте проверить работу приложения.${NC}" 