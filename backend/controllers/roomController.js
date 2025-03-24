const { Room, Booking } = require('../models');
const { Op } = require('sequelize');

// Получение всех номеров
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение номера по ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не найден' });
    }
    
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создание нового номера (только для админа)
exports.createRoom = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      capacity, 
      roomType, 
      amenities, 
      images, 
      floor, 
      roomNumber 
    } = req.body;
    
    const room = await Room.create({ 
      name, 
      description, 
      price, 
      capacity, 
      roomType, 
      amenities, 
      images, 
      floor, 
      roomNumber 
    });
    
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Обновление номера (только для админа)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не найден' });
    }
    
    await room.update(req.body);
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Удаление номера (только для админа)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не найден' });
    }
    
    // Проверяем, есть ли активные бронирования для этого номера
    const activeBookings = await Booking.findOne({ 
      where: { 
        RoomId: req.params.id,
        status: {
          [Op.in]: ['pending', 'confirmed']
        },
        checkOut: { [Op.gt]: new Date() }
      }
    });
    
    if (activeBookings) {
      return res.status(400).json({ 
        message: 'Невозможно удалить номер с активными бронированиями' 
      });
    }
    
    await room.destroy();
    res.json({ message: 'Номер успешно удален' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Поиск доступных номеров на определенные даты
exports.getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, capacity, roomType } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ 
        message: 'Необходимо указать даты заезда и выезда' 
      });
    }
    
    // Преобразуем строки в объекты Date
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Проверяем корректность дат
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ 
        message: 'Дата выезда должна быть позже даты заезда' 
      });
    }
    
    // Находим забронированные номера на указанные даты
    const bookedRoomIds = await Booking.findAll({
      attributes: ['RoomId'],
      where: {
        status: {
          [Op.in]: ['pending', 'confirmed']
        },
        [Op.or]: [
          {
            // Бронирование начинается в запрашиваемом периоде
            checkIn: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            // Бронирование заканчивается в запрашиваемом периоде
            checkOut: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            // Бронирование включает запрашиваемый период
            [Op.and]: [
              { checkIn: { [Op.lte]: checkInDate } },
              { checkOut: { [Op.gte]: checkOutDate } }
            ]
          }
        ]
      },
      raw: true
    }).then(bookings => bookings.map(booking => booking.RoomId));
    
    // Создаем запрос для поиска доступных номеров
    const whereCondition = {
      available: true,
      id: {
        [Op.notIn]: bookedRoomIds.length > 0 ? bookedRoomIds : [0]
      }
    };
    
    // Добавляем дополнительные фильтры, если они указаны
    if (capacity) {
      whereCondition.capacity = { [Op.gte]: parseInt(capacity, 10) };
    }
    
    if (roomType) {
      whereCondition.roomType = roomType;
    }
    
    const availableRooms = await Room.findAll({ where: whereCondition });
    
    res.json(availableRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 