# Проект "Лесной дворик" с административной панелью

Этот проект содержит фронтенд и бэкенд для сайта "Лесной дворик" с полнофункциональной административной панелью.

## Структура проекта

```
/
├── frontend/  # React фронтенд, размещенный на Vercel
└── backend/   # Express + MongoDB бэкенд для API и админки
```

## Инструкция по развертыванию

### 1. Развертывание бэкенда

Для корректной работы административной панели, необходимо сначала развернуть бэкенд:

#### Вариант 1: Развертывание на VPS с Docker

1. Подготовьте VPS с установленным Docker и Docker Compose
2. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/your-username/hotel-forest.git
   cd hotel-forest/backend
   ```

3. Настройте переменные окружения в `docker-compose.yml`:
   - Измените `JWT_SECRET` на уникальное значение
   - Измените `ADMIN_USERNAME` и `ADMIN_PASSWORD` на более безопасные

4. Запустите сервисы:
   ```bash
   docker-compose up -d
   ```

5. Настройте Nginx или другой reverse proxy для проксирования запросов к бэкенду и настройки HTTPS:
   ```nginx
   server {
     listen 80;
     server_name api.yourdomain.com;
     
     location / {
       return 301 https://$host$request_uri;
     }
   }
   
   server {
     listen 443 ssl;
     server_name api.yourdomain.com;
     
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
     
     location / {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

6. Настройте DNS для вашего домена, указав на IP-адрес вашего VPS.

#### Вариант 2: Развертывание на хостинге

1. Убедитесь, что ваш хостинг поддерживает Node.js и MongoDB
2. Загрузите файлы бэкенда на сервер:
   ```bash
   git clone https://github.com/your-username/hotel-forest.git
   cd hotel-forest/backend
   npm install
   ```

3. Создайте файл `.env` с настройками:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hotel_forest
   JWT_SECRET=ваш_секретный_ключ_jwt
   JWT_EXPIRES_IN=24h
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=ваш_надежный_пароль
   NODE_ENV=production
   ```

4. Настройте MongoDB или используйте облачный сервис MongoDB Atlas
5. Запустите сервер через PM2 или аналогичный менеджер процессов:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name hotel-forest-backend
   ```

### 2. Конфигурация фронтенда для взаимодействия с бэкендом

Фронтенд уже размещен на Vercel по адресу https://front-2-mu.vercel.app/.

Для корректной работы с развернутым бэкендом:

1. Войдите в панель управления Vercel
2. Перейдите в настройки проекта
3. Добавьте переменную окружения:
   - Название: `REACT_APP_API_URL`
   - Значение: URL вашего бэкенда, например `https://api.yourdomain.com`

4. Сохраните изменения и дождитесь повторного развертывания

### 3. Использование режима администратора

После настройки бэкенда и фронтенда:

1. Перейдите на сайт https://front-2-mu.vercel.app/
2. Прокрутите страницу до футера, где в правом нижнем углу будет ссылка "Режим администратора"
3. Нажмите на нее и введите данные для входа:
   - Логин: значение из `ADMIN_USERNAME`
   - Пароль: значение из `ADMIN_PASSWORD`

4. После успешного входа откроется панель администратора
5. В панели администратора вы можете:
   - Редактировать контент главной страницы
   - Управлять галереей (добавлять, редактировать, удалять фото)
   - Управлять номерами (добавлять, редактировать, удалять)

## Проверка работоспособности

1. Проверка бэкенда:
   ```bash
   curl https://api.yourdomain.com/api/gallery
   ```
   Должен вернуть JSON с галереей или пустой массив `[]`

2. Проверка аутентификации:
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"ваш_пароль"}'
   ```
   Должен вернуть токен в формате JSON

3. Проверка административной панели на фронтенде:
   - Перейдите на https://front-2-mu.vercel.app/
   - Войдите в режим администратора
   - Попробуйте внести изменения и убедитесь, что они сохраняются

## Дополнительные рекомендации

1. Регулярно создавайте резервные копии базы данных MongoDB:
   ```bash
   docker exec -it hotel-forest_mongodb_1 mongodump --out /dump
   docker cp hotel-forest_mongodb_1:/dump ./backup
   ```

2. Настройте Let's Encrypt для получения бесплатных SSL-сертификатов:
   ```bash
   certbot --nginx -d api.yourdomain.com
   ```

3. Настройте мониторинг для отслеживания доступности сервера

4. Для обновления бэкенда:
   ```bash
   cd hotel-forest/backend
   git pull
   docker-compose down
   docker-compose up -d --build
   ``` 