const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

// Получить все изображения галереи
exports.getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Ошибка при получении галереи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить изображение по ID
exports.getImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Изображение не найдено' });
    }
    
    res.json(image);
  } catch (error) {
    console.error('Ошибка при получении изображения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Загрузить новое изображение
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Нет загруженного изображения' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const { title, description, category } = req.body;
    const order = req.body.order ? parseInt(req.body.order) : 0;
    
    const newImage = new Gallery({
      title: title || 'Без названия',
      description: description || '',
      imageUrl,
      category: category || 'другое',
      order
    });
    
    await newImage.save();
    
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить информацию об изображении
exports.updateImage = async (req, res) => {
  try {
    const { title, description, category, order, isVisible } = req.body;
    
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Изображение не найдено' });
    }
    
    // Обновляем поля
    if (title !== undefined) image.title = title;
    if (description !== undefined) image.description = description;
    if (category !== undefined) image.category = category;
    if (order !== undefined) image.order = parseInt(order);
    if (isVisible !== undefined) image.isVisible = isVisible;
    
    await image.save();
    
    res.json(image);
  } catch (error) {
    console.error('Ошибка при обновлении изображения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить изображение
exports.deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Изображение не найдено' });
    }
    
    // Удаляем файл изображения
    const imagePath = path.join(__dirname, '../..', image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await Gallery.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 