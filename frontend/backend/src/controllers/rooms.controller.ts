import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Room, { IRoom } from '../models/Room';
import { AuthRequest } from '../middlewares/auth.middleware';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Получить все номера
 */
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find().sort({ title: 1 });
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Ошибка получения номеров:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения номеров'
    });
  }
};

/**
 * Получить номер по ID
 */
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Номер не найден'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Ошибка получения номера:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения номера'
    });
  }
};

/**
 * Создать новый номер
 */
export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Изображение номера не загружено'
      });
      return;
    }
    
    const {
      title,
      description,
      tag,
      features,
      price,
      priceNote,
      additionalPrice,
      additionalPriceNote,
      capacity,
      hasPrivateBathroom,
      size,
      bedType,
      roomCount
    } = req.body;
    
    // Валидация обязательных полей
    if (!title || !description || !price || !capacity || !size || !bedType) {
      // Удаляем изображение, если данные неполные
      fs.unlinkSync(req.file.path);
      
      res.status(400).json({
        success: false,
        message: 'Необходимо заполнить все обязательные поля'
      });
      return;
    }
    
    // Создаем путь к изображению
    const imagePath = `/uploads/rooms/${req.file.filename}`;
    
    // Парсим особенности из строки в массив
    const parsedFeatures = features ? 
      (typeof features === 'string' ? features.split(',').map(f => f.trim()) : features) : 
      [];
    
    // Создаем новый номер
    const newRoom = await Room.create({
      title,
      description,
      image: imagePath,
      tag,
      features: parsedFeatures,
      price,
      priceNote,
      additionalPrice,
      additionalPriceNote,
      capacity: Number(capacity),
      hasPrivateBathroom: hasPrivateBathroom === 'true',
      size: Number(size),
      bedType,
      roomCount: roomCount ? Number(roomCount) : undefined
    });
    
    res.status(201).json({
      success: true,
      data: newRoom
    });
  } catch (error) {
    console.error('Ошибка создания номера:', error);
    
    // Удаляем загруженное изображение в случае ошибки
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка создания номера'
    });
  }
};

/**
 * Обновить информацию о номере
 */
export const updateRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Проверяем, существует ли номер
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      // Если загружено новое изображение, удаляем его
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(404).json({
        success: false,
        message: 'Номер не найден'
      });
      return;
    }
    
    // Обновляем данные
    const updatedData: Partial<IRoom> = { ...req.body };
    
    // Обрабатываем features если они переданы
    if (req.body.features) {
      updatedData.features = typeof req.body.features === 'string' ? 
        req.body.features.split(',').map((f: string) => f.trim()) : 
        req.body.features;
    }
    
    // Преобразуем числовые значения
    if (req.body.capacity) updatedData.capacity = Number(req.body.capacity);
    if (req.body.size) updatedData.size = Number(req.body.size);
    if (req.body.roomCount) updatedData.roomCount = Number(req.body.roomCount);
    
    // Преобразуем булевые значения
    if (req.body.hasPrivateBathroom !== undefined) {
      updatedData.hasPrivateBathroom = req.body.hasPrivateBathroom === 'true';
    }
    
    // Если загружено новое изображение
    if (req.file) {
      // Удаляем старое изображение, если оно существует
      const oldImagePath = path.join(__dirname, '../../', room.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      // Устанавливаем новый путь к изображению
      updatedData.image = `/uploads/rooms/${req.file.filename}`;
    }
    
    // Обновляем номер в базе данных
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedRoom
    });
  } catch (error) {
    console.error('Ошибка обновления номера:', error);
    
    // Удаляем новое изображение, если есть
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка обновления номера'
    });
  }
};

/**
 * Удалить номер
 */
export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Проверяем, существует ли номер
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Номер не найден'
      });
      return;
    }
    
    // Удаляем изображение с сервера
    const imagePath = path.join(__dirname, '../../', room.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Удаляем номер из базы данных
    await Room.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Номер успешно удален'
    });
  } catch (error) {
    console.error('Ошибка удаления номера:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка удаления номера'
    });
  }
}; 