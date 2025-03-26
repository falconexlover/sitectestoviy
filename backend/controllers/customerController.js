const { User, Booking, Room } = require('../models');
const { Op } = require('sequelize');

// Получение всех клиентов (только для админа)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: 'customer' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение информации о клиенте по ID (только для админа)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findOne({
      where: {
        id: req.params.id,
        role: 'customer',
      },
      attributes: { exclude: ['password'] },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Клиент не найден' });
    }

    // Получаем историю бронирований клиента
    const bookings = await Booking.findAll({
      where: { UserId: req.params.id },
      include: [{ model: Room }],
      order: [['createdAt', 'DESC']],
    });

    res.json({ customer, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Поиск клиентов (только для админа)
exports.searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Поисковый запрос не указан' });
    }

    const customers = await User.findAll({
      where: {
        role: 'customer',
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { phone: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: { exclude: ['password'] },
    });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение статистики клиента (только для админа)
exports.getCustomerStats = async (req, res) => {
  try {
    const customer = await User.findOne({
      where: {
        id: req.params.id,
        role: 'customer',
      },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Клиент не найден' });
    }

    // Получаем все бронирования клиента
    const bookings = await Booking.findAll({
      where: {
        UserId: req.params.id,
        status: {
          [Op.in]: ['confirmed', 'completed'],
        },
      },
      include: [{ model: Room }],
    });

    // Рассчитываем статистику
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const totalNights = bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);

    // Получаем первое и последнее бронирование
    const sortedBookings = [...bookings].sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    const firstBooking = sortedBookings.length > 0 ? sortedBookings[0] : null;
    const lastBooking =
      sortedBookings.length > 0 ? sortedBookings[sortedBookings.length - 1] : null;

    // Подсчитываем предпочтения по типам номеров
    const roomTypePreferences = {};
    bookings.forEach((booking) => {
      const roomType = booking.Room.roomType;
      roomTypePreferences[roomType] = (roomTypePreferences[roomType] || 0) + 1;
    });

    res.json({
      totalBookings,
      totalSpent,
      totalNights,
      firstBookingDate: firstBooking ? firstBooking.checkIn : null,
      lastBookingDate: lastBooking ? lastBooking.checkIn : null,
      roomTypePreferences,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
