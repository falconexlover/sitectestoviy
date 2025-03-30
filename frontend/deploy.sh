#!/bin/bash

# Скрипт для сборки и деплоя проекта

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Функция для вывода информации с временем
log() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Проверка наличия зависимостей
check_dependencies() {
  log "Проверка зависимостей..."
  
  if ! [ -x "$(command -v node)" ]; then
    echo -e "${RED}Ошибка: Node.js не установлен.${NC}" >&2
    exit 1
  fi
  
  if ! [ -x "$(command -v npm)" ]; then
    echo -e "${RED}Ошибка: npm не установлен.${NC}" >&2
    exit 1
  fi
  
  # Вывод версий
  node_version=$(node -v)
  npm_version=$(npm -v)
  log "Node.js версия: ${node_version}"
  log "npm версия: ${npm_version}"
}

# Очистка предыдущей сборки
clean_build() {
  log "Очистка предыдущей сборки..."
  if [ -d "build" ]; then
    rm -rf build
    log "Директория build удалена"
  fi
}

# Установка зависимостей
install_dependencies() {
  log "Установка зависимостей..."
  npm ci
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при установке зависимостей.${NC}" >&2
    exit 1
  fi
  
  log "Зависимости успешно установлены."
}

# Проверка и копирование переменных окружения
setup_env() {
  log "Настройка переменных окружения..."
  
  if [ ! -f ".env.production" ]; then
    echo -e "${RED}Ошибка: Файл .env.production не найден.${NC}" >&2
    exit 1
  fi
  
  cp .env.production .env
  log "Файл .env.production скопирован в .env"
}

# Сборка проекта
build_project() {
  log "Запуск сборки проекта..."
  
  GENERATE_SOURCEMAP=false npm run build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при сборке проекта.${NC}" >&2
    exit 1
  fi
  
  log "Проект успешно собран."
}

# Проверка размера сборки
check_build_size() {
  log "Проверка размера сборки..."
  
  build_size=$(du -sh build | cut -f1)
  log "Размер сборки: ${build_size}"
  
  # Подсчет количества файлов
  file_count=$(find build -type f | wc -l)
  log "Количество файлов: ${file_count}"
  
  # Проверка наличия основных файлов
  if [ ! -f "build/index.html" ]; then
    echo -e "${RED}Внимание: build/index.html не найден.${NC}" >&2
  fi
  
  if [ ! -d "build/static" ]; then
    echo -e "${RED}Внимание: директория build/static не найдена.${NC}" >&2
  fi
}

# Основная функция
main() {
  log "Начало процесса сборки и подготовки к деплою..."
  
  check_dependencies
  clean_build
  install_dependencies
  setup_env
  build_project
  check_build_size
  
  echo -e "${GREEN}==========================================${NC}"
  log "Сборка успешно завершена. Проект готов к деплою."
  echo -e "${GREEN}==========================================${NC}"
}

# Запуск основной функции
main 