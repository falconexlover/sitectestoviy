const bookingService = require('../services/bookingService');
const logger = require('../utils/logger');
require('dotenv').config();

// Создание нового бронирования
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingData = { ...req.body, userId };

    const newBooking = await bookingService.createBooking(bookingData);
    res.status(201).json(newBooking);
  } catch (err) {
    if (
      err.message === 'Номер не найден' ||
      err.message === 'Номер недоступен на указанные даты' ||
      err.message === 'Даты заезда и выезда обязательны' ||
      err.message === 'Дата выезда должна быть позже даты заезда'
    ) {
      return res.status(400).json({ message: err.message });
    }

    logger.error('Ошибка при создании бронирования:', err);
    res.status(500).json({ message: 'Ошибка при создании бронирования' });
  }
};

// Получение всех бронирований для текущего пользователя
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getUserBookings(userId);
    res.json(bookings);
  } catch (err) {
    logger.error('Ошибка при получении бронирований пользователя:', err);
    res.status(500).json({ message: 'Ошибка при получении списка бронирований' });
  }
};

// Получение бронирования по ID
exports.getBookingById = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const booking = await bookingService.getBookingById(req.params.id, userId, isAdmin);
    res.json(booking);
  } catch (err) {
    if (
      err.message === 'Бронирование не найдено' ||
      err.message === 'У вас нет доступа к этому бронированию'
    ) {
      return res.status(404).json({ message: err.message });
    }

    logger.error('Ошибка при получении бронирования по ID:', err);
    res.status(500).json({ message: 'Ошибка при получении информации о бронировании' });
  }
};

// Отмена бронирования пользователем
exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    await bookingService.cancelBooking(req.params.id, userId, isAdmin);
    res.json({ message: 'Бронирование успешно отменено' });
  } catch (err) {
    if (
      err.message === 'Бронирование не найдено' ||
      err.message === 'У вас нет доступа к этому бронированию' ||
      err.message === 'Нельзя отменить бронирование после заезда'
    ) {
      return res.status(400).json({ message: err.message });
    }

    logger.error('Ошибка при отмене бронирования:', err);
    res.status(500).json({ message: 'Ошибка при отмене бронирования' });
  }
};

// Получение всех бронирований (только для админа)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, roomId } = req.query;
    const filters = { status, startDate, endDate, roomId };

    const bookings = await bookingService.getAllBookings(filters);
    res.json(bookings);
  } catch (err) {
    logger.error('Ошибка при получении всех бронирований:', err);
    res.status(500).json({ message: 'Ошибка при получении списка бронирований' });
  }
};

// Обновление статуса бронирования (только для админа)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Статус бронирования обязателен' });
    }

    const updatedBooking = await bookingService.updateBookingStatus(id, status);
    res.json(updatedBooking);
  } catch (err) {
    if (err.message === 'Бронирование не найдено') {
      return res.status(404).json({ message: err.message });
    }

    if (err.message === 'Недопустимый статус бронирования') {
      return res.status(400).json({ message: err.message });
    }

    logger.error('Ошибка при обновлении статуса бронирования:', err);
    res.status(500).json({ message: 'Ошибка при обновлении статуса бронирования' });
  }
};

// Проверка доступности номера
exports.checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Необходимо указать roomId, checkIn и checkOut' });
    }

    const isAvailable = await bookingService.checkRoomAvailability(roomId, checkIn, checkOut);
    res.json({ available: isAvailable });
  } catch (err) {
    logger.error('Ошибка при проверке доступности номера:', err);
    res.status(500).json({ message: 'Ошибка при проверке доступности номера' });
  }
};

// Получение статистики по бронированиям (для админа)
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await bookingService.getBookingStats();
    res.json(stats);
  } catch (err) {
    logger.error('Ошибка при получении статистики бронирований:', err);
    res.status(500).json({ message: 'Ошибка при получении статистики бронирований' });
  }
};
