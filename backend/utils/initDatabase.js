/**
 * Скрипт инициализации базы данных с тестовыми данными
 */
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { User, Room, Booking, Review } = require('../models');
const logger = require('./logger');

/**
 * Инициализирует базу данных тестовыми данными
 */
async function initDatabase() {
  try {
    logger.info('Начало инициализации базы данных...');

    // Включаем безопасный форсированный режим (только для разработки)
    await db.sync({ force: true });
    logger.info('База данных очищена и таблицы созданы заново');

    // Создаем администратора и тестовых пользователей
    const adminUser = await User.create({
      name: 'Администратор',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '+79001234567',
      role: 'admin',
    });
    logger.info(`Создан администратор: ${adminUser.email}`);

    const managerUser = await User.create({
      name: 'Менеджер',
      email: 'manager@example.com',
      password: await bcrypt.hash('manager123', 10),
      phone: '+79001234568',
      role: 'manager',
    });
    logger.info(`Создан менеджер: ${managerUser.email}`);

    const customer1 = await User.create({
      name: 'Иван Петров',
      email: 'ivan@example.com',
      password: await bcrypt.hash('customer123', 10),
      phone: '+79001234569',
      role: 'customer',
    });
    logger.info(`Создан клиент: ${customer1.email}`);

    const customer2 = await User.create({
      name: 'Анна Сидорова',
      email: 'anna@example.com',
      password: await bcrypt.hash('customer123', 10),
      phone: '+79001234570',
      role: 'customer',
    });
    logger.info(`Создан клиент: ${customer2.email}`);

    // Создаем тестовые номера
    const room1 = await Room.create({
      name: 'Стандартный одноместный',
      description: 'Уютный одноместный номер с видом на лес',
      roomType: 'standart',
      price: 3500,
      capacity: 1,
      amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Мини-бар'],
      images: ['room1_1.jpg', 'room1_2.jpg'],
      status: 'available',
    });
    logger.info(`Создан номер: ${room1.name}`);

    const room2 = await Room.create({
      name: 'Улучшенный двухместный',
      description: 'Просторный номер с двумя кроватями и балконом',
      roomType: 'superior',
      price: 5500,
      capacity: 2,
      amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Мини-бар', 'Сейф', 'Балкон'],
      images: ['room2_1.jpg', 'room2_2.jpg'],
      status: 'available',
    });
    logger.info(`Создан номер: ${room2.name}`);

    const room3 = await Room.create({
      name: 'Люкс',
      description: 'Роскошный номер с гостиной и спальней',
      roomType: 'suite',
      price: 8500,
      capacity: 3,
      amenities: [
        'Wi-Fi',
        'Телевизор',
        'Кондиционер',
        'Мини-бар',
        'Сейф',
        'Балкон',
        'Гостиная',
        'Джакузи',
      ],
      images: ['room3_1.jpg', 'room3_2.jpg', 'room3_3.jpg'],
      status: 'available',
    });
    logger.info(`Создан номер: ${room3.name}`);

    // Создаем тестовые бронирования
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    // Прошлое бронирование
    const booking1 = await Booking.create({
      checkIn: lastMonth,
      checkOut: today,
      totalPrice: 3500 * 30,
      guests: 1,
      status: 'completed',
      paymentStatus: 'paid',
      specialRequests: 'Ранний заезд',
      UserId: customer1.id,
      RoomId: room1.id,
    });
    logger.info(`Создано бронирование #${booking1.id} (завершенное)`);

    // Текущее бронирование
    const booking2 = await Booking.create({
      checkIn: today,
      checkOut: nextWeek,
      totalPrice: 5500 * 7,
      guests: 2,
      status: 'confirmed',
      paymentStatus: 'paid',
      specialRequests: 'Дополнительная подушка',
      UserId: customer2.id,
      RoomId: room2.id,
    });
    logger.info(`Создано бронирование #${booking2.id} (текущее)`);

    // Будущее бронирование
    const booking3 = await Booking.create({
      checkIn: nextWeek,
      checkOut: twoWeeksLater,
      totalPrice: 8500 * 7,
      guests: 2,
      status: 'confirmed',
      paymentStatus: 'pending',
      specialRequests: 'Вид на лес',
      UserId: customer1.id,
      RoomId: room3.id,
    });
    logger.info(`Создано бронирование #${booking3.id} (будущее)`);

    // Создаем тестовые отзывы
    const review1 = await Review.create({
      rating: 5,
      comment: 'Отличный номер, прекрасный сервис!',
      status: 'published',
      UserId: customer1.id,
      RoomId: room1.id,
    });
    logger.info(`Создан отзыв #${review1.id}`);

    const review2 = await Review.create({
      rating: 4,
      comment: 'Хороший номер, но немного шумно от дороги',
      status: 'published',
      UserId: customer2.id,
      RoomId: room2.id,
    });
    logger.info(`Создан отзыв #${review2.id}`);

    logger.info('Инициализация базы данных завершена успешно!');
    return true;
  } catch (error) {
    logger.error('Ошибка при инициализации базы данных:', error);
    return false;
  }
}

// Экспортируем функцию для использования в скриптах
module.exports = initDatabase;

// Если скрипт запущен напрямую, а не импортирован
if (require.main === module) {
  initDatabase()
    .then((result) => {
      if (result) {
        logger.info('База данных инициализирована успешно.');
        process.exit(0);
      } else {
        logger.error('Не удалось инициализировать базу данных.');
        process.exit(1);
      }
    })
    .catch((err) => {
      logger.error('Критическая ошибка при инициализации:', err);
      process.exit(1);
    });
} 