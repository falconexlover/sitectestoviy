# Схема базы данных проекта "Лесной Дворик"

Данный документ описывает структуру базы данных гостиничного комплекса "Лесной Дворик", включая таблицы, поля, связи и индексы.

## Диаграмма базы данных

```
+---------------+       +---------------+       +---------------+
|     Users     |       |     Rooms     |       |   RoomTypes   |
+---------------+       +---------------+       +---------------+
| id            |       | id            |       | id            |
| username      |       | number        |       | name          |
| email         |       | roomTypeId    +-------+ description   |
| password      |       | floor         |       | basePrice     |
| firstName     |       | status        |       | amenities     |
| lastName      |       | description   |       | capacity      |
| phone         |       | photos        |       | createdAt     |
| role          |       | createdAt     |       | updatedAt     |
| createdAt     |       | updatedAt     |       +---------------+
| updatedAt     |       +-------+-------+
+-------+-------+               |
        |                       |
        |                       |
        |                +------+------+
        |                |             |
        |                |             |
+-------v-------+    +---v-----------+ |
|   Customers   |    |   Bookings    | |
+---------------+    +---------------+ |
| id            |    | id            | |
| userId        +----+ customerId    | |
| address       |    | roomId        +-+
| passport      |    | checkIn       |
| birthDate     |    | checkOut      |
| preferences   |    | adults        |
| createdAt     |    | children      |
| updatedAt     |    | totalPrice    |
+---------------+    | status        |
                     | paymentStatus |
                     | paymentMethod |
                     | notes         |
                     | createdAt     |
                     | updatedAt     |
                     +-------+-------+
                             |
                             |
                     +-------v-------+
                     |   Payments    |
                     +---------------+
                     | id            |
                     | bookingId     |
                     | amount        |
                     | method        |
                     | status        |
                     | transactionId |
                     | paymentDate   |
                     | createdAt     |
                     | updatedAt     |
                     +---------------+
```

## Описание таблиц

### Users

Хранит информацию о пользователях системы, включая клиентов, администраторов и менеджеров.

| Поле      | Тип          | Описание                                     | Ограничения                  |
| --------- | ------------ | -------------------------------------------- | ---------------------------- |
| id        | INTEGER      | Уникальный идентификатор                     | PRIMARY KEY, AUTO            |
| username  | VARCHAR(50)  | Имя пользователя для входа                   | UNIQUE, NOT NULL             |
| email     | VARCHAR(100) | Email адрес                                  | UNIQUE, NOT NULL             |
| password  | VARCHAR(100) | Хешированный пароль                          | NOT NULL                     |
| firstName | VARCHAR(50)  | Имя                                          | NULL                         |
| lastName  | VARCHAR(50)  | Фамилия                                      | NULL                         |
| phone     | VARCHAR(20)  | Номер телефона                               | NULL                         |
| role      | VARCHAR(20)  | Роль пользователя (customer, admin, manager) | NOT NULL, DEFAULT 'customer' |
| createdAt | TIMESTAMP    | Дата и время создания записи                 | NOT NULL                     |
| updatedAt | TIMESTAMP    | Дата и время последнего обновления           | NOT NULL                     |

### Customers

Расширенная информация о клиентах гостиницы.

| Поле        | Тип          | Описание                           | Ограничения           |
| ----------- | ------------ | ---------------------------------- | --------------------- |
| id          | INTEGER      | Уникальный идентификатор           | PRIMARY KEY, AUTO     |
| userId      | INTEGER      | Связь с таблицей Users             | FOREIGN KEY, NOT NULL |
| address     | VARCHAR(255) | Адрес проживания                   | NULL                  |
| passport    | VARCHAR(50)  | Паспортные данные                  | NULL                  |
| birthDate   | DATE         | Дата рождения                      | NULL                  |
| preferences | TEXT         | Предпочтения клиента (JSON)        | NULL                  |
| createdAt   | TIMESTAMP    | Дата и время создания записи       | NOT NULL              |
| updatedAt   | TIMESTAMP    | Дата и время последнего обновления | NOT NULL              |

### RoomTypes

Типы номеров, доступные в гостинице.

| Поле        | Тип           | Описание                                  | Ограничения       |
| ----------- | ------------- | ----------------------------------------- | ----------------- |
| id          | INTEGER       | Уникальный идентификатор                  | PRIMARY KEY, AUTO |
| name        | VARCHAR(100)  | Название типа номера                      | NOT NULL          |
| description | TEXT          | Описание типа номера                      | NOT NULL          |
| basePrice   | DECIMAL(10,2) | Базовая цена за ночь                      | NOT NULL          |
| amenities   | TEXT          | Удобства, предоставляемые в номере (JSON) | NULL              |
| capacity    | INTEGER       | Максимальное количество гостей            | NOT NULL          |
| createdAt   | TIMESTAMP     | Дата и время создания записи              | NOT NULL          |
| updatedAt   | TIMESTAMP     | Дата и время последнего обновления        | NOT NULL          |

### Rooms

Конкретные номера в гостинице.

| Поле        | Тип         | Описание                                         | Ограничения                   |
| ----------- | ----------- | ------------------------------------------------ | ----------------------------- |
| id          | INTEGER     | Уникальный идентификатор                         | PRIMARY KEY, AUTO             |
| number      | VARCHAR(10) | Номер комнаты                                    | UNIQUE, NOT NULL              |
| roomTypeId  | INTEGER     | Связь с таблицей RoomTypes                       | FOREIGN KEY, NOT NULL         |
| floor       | INTEGER     | Этаж                                             | NOT NULL                      |
| status      | VARCHAR(20) | Статус номера (available, occupied, maintenance) | NOT NULL, DEFAULT 'available' |
| description | TEXT        | Дополнительное описание                          | NULL                          |
| photos      | TEXT        | JSON-массив URL фотографий                       | NULL                          |
| createdAt   | TIMESTAMP   | Дата и время создания записи                     | NOT NULL                      |
| updatedAt   | TIMESTAMP   | Дата и время последнего обновления               | NOT NULL                      |

### Bookings

Бронирования номеров.

| Поле          | Тип           | Описание                                              | Ограничения                   |
| ------------- | ------------- | ----------------------------------------------------- | ----------------------------- |
| id            | INTEGER       | Уникальный идентификатор                              | PRIMARY KEY, AUTO             |
| customerId    | INTEGER       | Связь с таблицей Customers                            | FOREIGN KEY, NOT NULL         |
| roomId        | INTEGER       | Связь с таблицей Rooms                                | FOREIGN KEY, NOT NULL         |
| checkIn       | DATE          | Дата заезда                                           | NOT NULL                      |
| checkOut      | DATE          | Дата выезда                                           | NOT NULL                      |
| adults        | INTEGER       | Количество взрослых                                   | NOT NULL, DEFAULT 1           |
| children      | INTEGER       | Количество детей                                      | NOT NULL, DEFAULT 0           |
| totalPrice    | DECIMAL(10,2) | Общая стоимость бронирования                          | NOT NULL                      |
| status        | VARCHAR(20)   | Статус бронирования (confirmed, cancelled, completed) | NOT NULL, DEFAULT 'confirmed' |
| paymentStatus | VARCHAR(20)   | Статус оплаты (unpaid, partial, paid)                 | NOT NULL, DEFAULT 'unpaid'    |
| paymentMethod | VARCHAR(20)   | Способ оплаты (card, cash, transfer)                  | NULL                          |
| notes         | TEXT          | Дополнительные заметки                                | NULL                          |
| createdAt     | TIMESTAMP     | Дата и время создания записи                          | NOT NULL                      |
| updatedAt     | TIMESTAMP     | Дата и время последнего обновления                    | NOT NULL                      |

### Payments

Платежи по бронированиям.

| Поле          | Тип           | Описание                                              | Ограничения           |
| ------------- | ------------- | ----------------------------------------------------- | --------------------- |
| id            | INTEGER       | Уникальный идентификатор                              | PRIMARY KEY, AUTO     |
| bookingId     | INTEGER       | Связь с таблицей Bookings                             | FOREIGN KEY, NOT NULL |
| amount        | DECIMAL(10,2) | Сумма платежа                                         | NOT NULL              |
| method        | VARCHAR(20)   | Метод оплаты (card, cash, transfer)                   | NOT NULL              |
| status        | VARCHAR(20)   | Статус платежа (pending, completed, failed, refunded) | NOT NULL              |
| transactionId | VARCHAR(100)  | Внешний идентификатор транзакции                      | NULL                  |
| paymentDate   | TIMESTAMP     | Дата и время платежа                                  | NOT NULL              |
| createdAt     | TIMESTAMP     | Дата и время создания записи                          | NOT NULL              |
| updatedAt     | TIMESTAMP     | Дата и время последнего обновления                    | NOT NULL              |

## Индексы

### Первичные ключи

- `Users.id`
- `Customers.id`
- `RoomTypes.id`
- `Rooms.id`
- `Bookings.id`
- `Payments.id`

### Уникальные индексы

- `Users.username`
- `Users.email`
- `Rooms.number`

### Внешние ключи

- `Customers.userId` -> `Users.id`
- `Rooms.roomTypeId` -> `RoomTypes.id`
- `Bookings.customerId` -> `Customers.id`
- `Bookings.roomId` -> `Rooms.id`
- `Payments.bookingId` -> `Bookings.id`

### Дополнительные индексы

- `Bookings.checkIn`
- `Bookings.checkOut`
- `Bookings.status`
- `Rooms.status`
- `Payments.paymentDate`

## Триггеры и функции

### Проверка доступности номера

Триггер, который запускается перед вставкой новой записи в таблицу `Bookings`, проверяет, свободен ли номер на указанные даты:

```sql
CREATE OR REPLACE FUNCTION check_room_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM Bookings
    WHERE roomId = NEW.roomId
    AND status != 'cancelled'
    AND (
      (NEW.checkIn BETWEEN checkIn AND checkOut - INTERVAL '1 day')
      OR (NEW.checkOut - INTERVAL '1 day' BETWEEN checkIn AND checkOut - INTERVAL '1 day')
      OR (checkIn BETWEEN NEW.checkIn AND NEW.checkOut - INTERVAL '1 day')
    )
  ) THEN
    RAISE EXCEPTION 'Room is not available for the selected dates';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_booking_insert
BEFORE INSERT ON Bookings
FOR EACH ROW
EXECUTE FUNCTION check_room_availability();
```

### Обновление статуса номера

Триггер, который обновляет статус номера при создании или обновлении бронирования:

```sql
CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
  -- При создании бронирования
  IF (TG_OP = 'INSERT' AND NEW.status = 'confirmed') THEN
    -- Проверяем, не пересекается ли бронирование с текущей датой
    IF (CURRENT_DATE BETWEEN NEW.checkIn AND NEW.checkOut - INTERVAL '1 day') THEN
      UPDATE Rooms SET status = 'occupied' WHERE id = NEW.roomId;
    END IF;
  -- При изменении статуса бронирования
  ELSIF (TG_OP = 'UPDATE' AND NEW.status != OLD.status) THEN
    IF (NEW.status = 'cancelled') THEN
      -- Если текущая дата в периоде бронирования и номер был занят этим бронированием
      IF (CURRENT_DATE BETWEEN NEW.checkIn AND NEW.checkOut - INTERVAL '1 day') THEN
        UPDATE Rooms SET status = 'available' WHERE id = NEW.roomId;
      END IF;
    ELSIF (NEW.status = 'confirmed' AND CURRENT_DATE BETWEEN NEW.checkIn AND NEW.checkOut - INTERVAL '1 day') THEN
      UPDATE Rooms SET status = 'occupied' WHERE id = NEW.roomId;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_booking_change
AFTER INSERT OR UPDATE ON Bookings
FOR EACH ROW
EXECUTE FUNCTION update_room_status();
```

## Примечания по безопасности данных

1. **Хеширование паролей**: Пароли в таблице `Users` хранятся в хешированном виде с использованием bcrypt.

2. **Защита персональных данных**: Необходимо обеспечить шифрование полей с персональными данными в таблице `Customers`, особенно паспортные данные.

3. **Аудит**: Все действия с бронированиями и платежами должны логироваться в системе аудита.

4. **Резервное копирование**: Необходимо настроить регулярное резервное копирование базы данных.

## Миграция базы данных

Для управления схемой базы данных используется Sequelize и миграции, которые хранятся в директории `backend/migrations/`.
