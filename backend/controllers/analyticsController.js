const { User, Booking, Room } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Получение общей статистики (только для админа)
exports.getOverallStats = async (req, res) => {
  try {
    // Получаем общее количество номеров и бронирований
    const totalRooms = await Room.count();
    const totalBookings = await Booking.count();
    const totalCustomers = await User.count({ where: { role: 'customer' } });

    // Получаем текущие активные бронирования
    const now = new Date();
    const activeBookings = await Booking.count({
      where: {
        status: 'confirmed',
        checkIn: { [Op.lte]: now },
        checkOut: { [Op.gte]: now },
      },
    });

    // Получаем общий доход
    const totalRevenue = await Booking.sum('totalPrice', {
      where: {
        status: {
          [Op.in]: ['confirmed', 'completed'],
        },
      },
    });

    // Получаем занятость номеров (заняты сейчас)
    const occupancyRate = (activeBookings / totalRooms) * 100;

    res.json({
      totalRooms,
      totalBookings,
      totalCustomers,
      activeBookings,
      totalRevenue: totalRevenue || 0,
      occupancyRate: occupancyRate || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение статистики по периоду (только для админа)
exports.getStatsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Необходимо указать начальную и конечную дату периода',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Проверяем корректность дат
    if (start >= end) {
      return res.status(400).json({
        message: 'Конечная дата должна быть позже начальной даты',
      });
    }

    // Получаем бронирования за период
    const bookingsInPeriod = await Booking.findAll({
      where: {
        [Op.or]: [
          {
            // Бронирование начинается в периоде
            checkIn: {
              [Op.between]: [start, end],
            },
          },
          {
            // Бронирование заканчивается в периоде
            checkOut: {
              [Op.between]: [start, end],
            },
          },
          {
            // Бронирование полностью включает период
            [Op.and]: [{ checkIn: { [Op.lte]: start } }, { checkOut: { [Op.gte]: end } }],
          },
        ],
        status: {
          [Op.in]: ['confirmed', 'completed'],
        },
      },
      include: [{ model: Room }],
    });

    // Рассчитываем доход за период
    const revenueInPeriod = bookingsInPeriod.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Рассчитываем статистику по типам номеров
    const roomTypeStats = {};
    bookingsInPeriod.forEach((booking) => {
      const roomType = booking.Room.roomType;
      if (!roomTypeStats[roomType]) {
        roomTypeStats[roomType] = {
          count: 0,
          revenue: 0,
        };
      }
      roomTypeStats[roomType].count += 1;
      roomTypeStats[roomType].revenue += booking.totalPrice;
    });

    // Получаем новых клиентов за период
    const newCustomers = await User.count({
      where: {
        role: 'customer',
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    });

    res.json({
      totalBookings: bookingsInPeriod.length,
      totalRevenue: revenueInPeriod,
      roomTypeStats,
      newCustomers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение прогноза занятости (только для админа)
exports.getOccupancyForecast = async (req, res) => {
  try {
    const { days } = req.query;
    const forecastDays = parseInt(days) || 30; // По умолчанию 30 дней

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + forecastDays);

    // Получаем все бронирования на запрашиваемый период
    const bookings = await Booking.findAll({
      where: {
        status: 'confirmed',
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [today, endDate],
            },
          },
          {
            checkOut: {
              [Op.between]: [today, endDate],
            },
          },
          {
            [Op.and]: [{ checkIn: { [Op.lte]: today } }, { checkOut: { [Op.gte]: endDate } }],
          },
        ],
      },
      include: [{ model: Room }],
    });

    // Рассчитываем занятость для каждого дня
    const forecast = [];
    const totalRooms = await Room.count();

    for (let i = 0; i < forecastDays; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      // Считаем количество занятых номеров на эту дату
      const occupiedRooms = bookings.filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);
        return date >= checkIn && date < checkOut;
      }).length;

      const occupancyRate = (occupiedRooms / totalRooms) * 100;

      forecast.push({
        date: date.toISOString().split('T')[0],
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupancyRate,
      });
    }

    res.json(forecast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение популярных номеров (только для админа)
exports.getPopularRooms = async (req, res) => {
  try {
    const { limit } = req.query;
    const numRooms = parseInt(limit) || 5; // По умолчанию 5 номеров

    // Получаем статистику бронирований по номерам
    const popularRooms = await Booking.findAll({
      attributes: [
        'RoomId',
        [sequelize.fn('COUNT', sequelize.col('RoomId')), 'bookingCount'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue'],
      ],
      where: {
        status: {
          [Op.in]: ['confirmed', 'completed'],
        },
      },
      include: [
        {
          model: Room,
          attributes: ['name', 'roomType', 'price', 'capacity'],
        },
      ],
      group: ['RoomId', 'Room.id'],
      order: [[sequelize.literal('bookingCount'), 'DESC']],
      limit: numRooms,
    });

    res.json(popularRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Добавляем недостающие функции для маршрутов аналитики
exports.getBookingAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const timeFrame = period || 'month'; // по умолчанию за месяц
    
    const now = new Date();
    let startDate;
    
    switch(timeFrame) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    const bookings = await Booking.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, now]
        }
      },
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [[sequelize.literal('date'), 'ASC']]
    });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const timeFrame = period || 'month'; // по умолчанию за месяц
    
    const now = new Date();
    let startDate;
    
    switch(timeFrame) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    const revenue = await Booking.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'completed']
        },
        createdAt: {
          [Op.between]: [startDate, now]
        }
      },
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('sum', sequelize.col('totalPrice')), 'totalRevenue']
      ],
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [[sequelize.literal('date'), 'ASC']]
    });
    
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOccupancyAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 30); // аналитика на 30 дней вперед
    
    // Получаем общее количество номеров
    const totalRooms = await Room.count();
    
    // Получаем бронирования на следующие 30 дней
    const bookings = await Booking.findAll({
      where: {
        status: 'confirmed',
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [now, endDate]
            }
          },
          {
            checkOut: {
              [Op.between]: [now, endDate]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: now } },
              { checkOut: { [Op.gte]: endDate } }
            ]
          }
        ]
      },
      attributes: ['checkIn', 'checkOut']
    });
    
    // Рассчитываем занятость по дням
    const occupancyByDay = {};
    
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);
      
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Считаем количество занятых номеров на эту дату
      const occupiedRooms = bookings.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);
        
        return currentDate >= checkIn && currentDate < checkOut;
      }).length;
      
      const occupancyRate = (occupiedRooms / totalRooms) * 100;
      
      occupancyByDay[dateString] = {
        date: dateString,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupancyRate: Math.round(occupancyRate * 100) / 100
      };
    }
    
    res.json(Object.values(occupancyByDay));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
