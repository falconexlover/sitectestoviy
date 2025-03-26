#!/bin/bash

# Загрузка переменных из .env файла
source "$(dirname "$0")/../.env"

# Путь к файлу базы данных SQLite
DB_FILE="$(dirname "$0")/../database.sqlite"

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

# Создание резервной копии текущей базы данных перед восстановлением
TEMP_BACKUP_DIR="$(dirname "$0")/../backups/temp"
mkdir -p "$TEMP_BACKUP_DIR"
TEMP_BACKUP="$TEMP_BACKUP_DIR/before_restore_$(date +"%Y-%m-%d_%H-%M-%S").sqlite"
cp "$DB_FILE" "$TEMP_BACKUP"
echo "Создана временная резервная копия текущей базы данных: $TEMP_BACKUP"

# Восстановление базы данных
echo "Восстановление базы данных из файла $BACKUP_FILE..."
# Останавливаем сервер перед восстановлением, если нужно
# [код остановки сервера здесь]

# Фактическое восстановление
cp "$BACKUP_FILE" "$DB_FILE"

# Проверка результата
if [ $? -eq 0 ]; then
  echo "База данных успешно восстановлена из файла: $BACKUP_FILE"
  # Запускаем сервер после восстановления, если нужно
  # [код запуска сервера здесь]
else
  echo "Ошибка при восстановлении базы данных!"
  # Восстанавливаем из временной копии
  echo "Восстановление из временной копии..."
  cp "$TEMP_BACKUP" "$DB_FILE"
  if [ $? -eq 0 ]; then
    echo "Успешно восстановлено из временной копии."
  else
    echo "Критическая ошибка: не удалось восстановиться из временной копии!"
  fi
  exit 1
fi 