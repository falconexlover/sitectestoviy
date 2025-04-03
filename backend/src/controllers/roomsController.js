const Room = require('../models/Room');
const fs = require('fs');
const path = require('path');

// Получить все номера
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ order: 1, createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error('Ошибка при получении номеров:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить номер по ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не найден' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Ошибка при получении номера:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать новый номер
exports.createRoom = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Необходимо загрузить главное изображение номера' });
    }
    
    const mainImageUrl = `/uploads/${req.file.filename}`;
    
    const { 
      title, 
      description, 
      price, 
      capacity, 
      size, 
      amenities = [],
      order = 0,
      isVisible = true 
    } = req.body;
    
    // Проверяем обязательные поля
    if (!title || !description || !price || !capacity || !size) {
      return res.status(400).json({ 
        message: 'Все поля (название, описание, цена, вместимость, площадь) обязательны' 
      });
    }
    
    // Создаем новый номер
    const newRoom = new Room({
      title,
      description,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      size: parseFloat(size),
      amenities: Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim()),
      mainImage: mainImageUrl,
      order: parseInt(order),
      isVisible
    });
    
    await newRoom.save();
    
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Ошибка при создании номера:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить номер
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не найден' });
    }
    
    const { 
      title, 
      description, 
      price, 
      capacity, 
      size, 
      amenities,
      order,
      isVisible 
    } = req.body;
    
    // Обновляем поля
    if (title) room.title = title;
    if (description) room.description = description;
    if (price) room.price = parseFloat(price);
    if (capacity) room.capacity = parseInt(capacity);
    if (size) room.size = parseFloat(size);
    if (amenities) {
      room.amenities = Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim());
    }
    if (order !== undefined) room.order = parseInt(order);
    if (isVisible !== undefined) room.isVisible = isVisible === 'true' || isVisible === true;
    
    // Если загружено новое главное изображение
    if (req.file) {
      // Удаляем старое изображение
      const oldImagePath = path.join(__dirname, '../..', room.mainImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      // Устанавливаем новое изображение
      room.mainImage = `/uploads/${req.file.filename}`;
    }
    
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error('Ошибка при обновлении номера:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить номер
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не найден' });
    }
    
    // Удаляем главное изображение
    const mainImagePath = path.join(__dirname, '../..', room.mainImage);
    if (fs.existsSync(mainImagePath)) {
      fs.unlinkSync(mainImagePath);
    }
    
    // Удаляем все дополнительные изображения
    room.images.forEach(imageUrl => {
      const imagePath = path.join(__dirname, '../..', imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
    
    await Room.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Номер успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении номера:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 