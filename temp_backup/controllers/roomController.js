const { Room, Booking } = require('../models');
const { Op } = require('sequelize');
const imageOptimizer = require('../utils/imageOptimizer');
const path = require('path');
const fs = require('fs');

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

// Обновляем функцию загрузки изображений для номера с поддержкой оптимизации
exports.uploadRoomImages = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверка существования номера
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: req.tError('booking.roomNotFound') });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: req.tError('validation.noFilesUploaded') });
    }
    
    const uploadPath = './public/uploads/rooms';
    const optimizedPath = './public/uploads/rooms/optimized';
    
    // Создаем директории, если их нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    if (!fs.existsSync(optimizedPath)) {
      fs.mkdirSync(optimizedPath, { recursive: true });
    }
    
    const uploadedImages = [];
    const optimizedImages = [];
    
    // Обрабатываем каждое загруженное изображение
    for (const file of req.files) {
      const originalFilename = file.originalname;
      const fileExtension = path.extname(originalFilename);
      const baseFilename = path.basename(originalFilename, fileExtension);
      
      // Генерируем уникальное имя файла
      const uniqueFilename = `${baseFilename}-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadPath, uniqueFilename);
      
      // Сохраняем оригинальное изображение
      fs.writeFileSync(filePath, file.buffer);
      uploadedImages.push(uniqueFilename);
      
      // Оптимизируем изображение в различных форматах и размерах
      try {
        const optimizationResult = await imageOptimizer.generateResponsiveImages(
          filePath,
          optimizedPath,
          `${room.id}-${baseFilename}-${Date.now()}`,
          {
            sizes: [400, 800, 1200], // разные размеры
            formats: ['webp', 'jpg'], // оптимизируем в нескольких форматах
            quality: 85 // качество сжатия
          }
        );
        
        // Сохраняем информацию об оптимизированных версиях
        optimizedImages.push(optimizationResult);
      } catch (optimizationError) {
        logger.error(`Ошибка при оптимизации изображения: ${optimizationError.message}`, { 
          error: optimizationError,
          filename: uniqueFilename 
        });
      }
    }
    
    // Обновляем массив изображений в базе данных
    let currentImages = room.images || [];
    if (typeof currentImages === 'string') {
      try {
        currentImages = JSON.parse(currentImages);
      } catch (e) {
        currentImages = [];
      }
    }
    
    // Добавляем новые изображения
    const updatedImages = [...currentImages, ...uploadedImages];
    
    // Обновляем комнату с новыми изображениями
    await room.update({ images: updatedImages });
    
    // Формируем информацию о путях к оптимизированным изображениям для фронтенда
    const optimizedPaths = optimizedImages.map(result => {
      const webpVersions = result.versions.webp.map(version => ({
        width: version.width,
        path: `/uploads/rooms/optimized/${path.basename(version.optimizedPath)}`,
        size: version.optimizedSize
      }));
      
      const jpgVersions = result.versions.jpg ? result.versions.jpg.map(version => ({
        width: version.width,
        path: `/uploads/rooms/optimized/${path.basename(version.optimizedPath)}`,
        size: version.optimizedSize
      })) : [];
      
      return {
        original: `/uploads/rooms/${path.basename(result.original)}`,
        webp: webpVersions,
        jpg: jpgVersions
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
        room,
        uploadedImages,
        optimizedImages: optimizedPaths
      }
    });
  } catch (err) {
    logger.error(`Ошибка при загрузке изображений: ${err.message}`, err);
    res.status(500).json({ message: req.tError('general.serverError') });
  }
}; 