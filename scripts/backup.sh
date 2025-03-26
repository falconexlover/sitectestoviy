#!/bin/bash

# Загрузка переменных из .env файла
source "$(dirname "$0")/../.env"

# Создание директории для бэкапов, если она не существует
BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"

# Базы данных SQLite
DB_FILE="$(dirname "$0")/../database.sqlite"

# Проверяем существование файла базы данных
if [ ! -f "$DB_FILE" ]; then
  echo "Файл базы данных не найден: $DB_FILE"
  exit 1
fi

# Формирование имени файла с датой и временем
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sqlite"

# Создание бэкапа
echo "Создание бэкапа базы данных SQLite..."
cp "$DB_FILE" "$BACKUP_FILE"

# Проверка результата
if [ $? -eq 0 ]; then
  echo "Бэкап успешно создан: $BACKUP_FILE"
  
  # Сжатие файла для экономии места
  gzip "$BACKUP_FILE"
  echo "Файл бэкапа сжат: $BACKUP_FILE.gz"
  
  # Удаление старых бэкапов (оставляем только последние 10)
  find "$BACKUP_DIR" -name "backup_*.sqlite.gz" -type f | sort -r | tail -n +11 | xargs -r rm
  echo "Старые бэкапы удалены. Оставлены только последние 10 файлов."
else
  echo "Ошибка при создании бэкапа!"
  exit 1
fi 