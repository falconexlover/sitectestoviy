import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import GalleryImage, { IGalleryImage } from '../models/Gallery';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Получить все изображения галереи
 */
export const getAllImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    
    // Если указана категория, фильтруем по ней
    const filter = category ? { category } : {};
    
    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Ошибка получения изображений галереи:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения изображений'
    });
  }
};

/**
 * Получить одно изображение по ID
 */
export const getImageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Изображение не найдено'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Ошибка получения изображения:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения изображения'
    });
  }
};

/**
 * Загрузить новое изображение в галерею
 */
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
      return;
    }
    
    const { title, description, category } = req.body;
    
    if (!title || !category) {
      // Удаляем загруженный файл, так как метаданные неполные
      fs.unlinkSync(req.file.path);
      
      res.status(400).json({
        success: false,
        message: 'Название и категория обязательны'
      });
      return;
    }
    
    // Создаем запись в базе данных
    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    
    const newImage = await GalleryImage.create({
      title,
      description: description || '',
      category,
      imagePath: imageUrl,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });
    
    res.status(201).json({
      success: true,
      data: newImage
    });
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    
    // Удаляем загруженный файл, если произошла ошибка
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка загрузки изображения'
    });
  }
};

/**
 * Обновить информацию об изображении (название, описание, категория)
 */
export const updateImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category } = req.body;
    
    // Проверяем, есть ли изображение
    const image = await GalleryImage.findById(req.params.id);
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Изображение не найдено'
      });
      return;
    }
    
    // Обновляем изображение
    const updatedImage = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      {
        title: title || image.title,
        description: description !== undefined ? description : image.description,
        category: category || image.category
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedImage
    });
  } catch (error) {
    console.error('Ошибка обновления изображения:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка обновления изображения'
    });
  }
};

/**
 * Удалить изображение
 */
export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Находим изображение
    const image = await GalleryImage.findById(req.params.id);
    
    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Изображение не найдено'
      });
      return;
    }
    
    // Удаляем файл с сервера
    const filePath = path.join(__dirname, '../../', image.imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Удаляем запись из базы данных
    await GalleryImage.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Изображение успешно удалено'
    });
  } catch (error) {
    console.error('Ошибка удаления изображения:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка удаления изображения'
    });
  }
}; 