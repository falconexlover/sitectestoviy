/**
 * Сервис для работы с номерами
 */

const { Room, Booking } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Получение всех номеров
 * @returns {Promise<Array>} Массив всех номеров
 */
exports.getAllRooms = async () => {
  try {
    return await Room.findAll();
  } catch (error) {
    logger.error('Ошибка при получении всех номеров:', error);
    throw error;
  }
};

/**
 * Получение номера по ID
 * @param {number} id ID номера
 * @returns {Promise<Object>} Данные номера
 */
exports.getRoomById = async (id) => {
  try {
    const room = await Room.findByPk(id);
    if (!room) {
      throw new Error('Номер не найден');
    }
    return room;
  } catch (error) {
    logger.error(`Ошибка при получении номера по ID ${id}:`, error);
    throw error;
  }
};

/**
 * Создание нового номера
 * @param {Object} roomData Данные для создания номера
 * @returns {Promise<Object>} Созданный номер
 */
exports.createRoom = async (roomData) => {
  try {
    return await Room.create(roomData);
  } catch (error) {
    logger.error('Ошибка при создании номера:', error);
    throw error;
  }
};

/**
 * Обновление номера
 * @param {number} id ID номера
 * @param {Object} roomData Данные для обновления
 * @returns {Promise<Object>} Обновленный номер
 */
exports.updateRoom = async (id, roomData) => {
  try {
    const room = await Room.findByPk(id);
    if (!room) {
      throw new Error('Номер не найден');
    }
    return await room.update(roomData);
  } catch (error) {
    logger.error(`Ошибка при обновлении номера с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Удаление номера
 * @param {number} id ID номера
 * @returns {Promise<boolean>} Результат операции
 */
exports.deleteRoom = async (id) => {
  try {
    const room = await Room.findByPk(id);
    if (!room) {
      throw new Error('Номер не найден');
    }

    // Проверяем, есть ли активные бронирования для этого номера
    const activeBookings = await Booking.findOne({
      where: {
        RoomId: id,
        status: {
          [Op.in]: ['pending', 'confirmed'],
        },
        checkOut: { [Op.gt]: new Date() },
      },
    });

    if (activeBookings) {
      throw new Error('Невозможно удалить номер с активными бронированиями');
    }

    await room.destroy();
    return true;
  } catch (error) {
    logger.error(`Ошибка при удалении номера с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Поиск доступных номеров по датам
 * @param {Object} options Опции поиска (даты, тип номера, вместимость)
 * @returns {Promise<Array>} Массив доступных номеров
 */
exports.getAvailableRooms = async (options) => {
  try {
    const { checkIn, checkOut, capacity, roomType } = options;

    if (!checkIn || !checkOut) {
      throw new Error('Необходимо указать даты заезда и выезда');
    }

    // Преобразуем строки в объекты Date
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Проверяем корректность дат
    if (checkInDate >= checkOutDate) {
      throw new Error('Дата выезда должна быть позже даты заезда');
    }

    // Находим забронированные номера на указанные даты
    const bookedRoomIds = await Booking.findAll({
      attributes: ['RoomId'],
      where: {
        status: {
          [Op.in]: ['pending', 'confirmed'],
        },
        [Op.or]: [
          {
            // Бронирование начинается в запрашиваемом периоде
            checkIn: {
              [Op.between]: [checkInDate, checkOutDate],
            },
          },
          {
            // Бронирование заканчивается в запрашиваемом периоде
            checkOut: {
              [Op.between]: [checkInDate, checkOutDate],
            },
          },
          {
            // Бронирование включает запрашиваемый период
            [Op.and]: [
              { checkIn: { [Op.lte]: checkInDate } },
              { checkOut: { [Op.gte]: checkOutDate } },
            ],
          },
        ],
      },
      raw: true,
    }).then((bookings) => bookings.map((booking) => booking.RoomId));

    // Создаем запрос для поиска доступных номеров
    const whereCondition = {
      available: true,
      id: {
        [Op.notIn]: bookedRoomIds.length > 0 ? bookedRoomIds : [0],
      },
    };

    // Добавляем дополнительные фильтры, если они указаны
    if (capacity) {
      whereCondition.capacity = { [Op.gte]: parseInt(capacity, 10) };
    }

    if (roomType) {
      whereCondition.roomType = roomType;
    }

    return await Room.findAll({ where: whereCondition });
  } catch (error) {
    logger.error('Ошибка при поиске доступных номеров:', error);
    throw error;
  }
};
