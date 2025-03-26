const roomService = require('../services/roomService');
const imageOptimizer = require('../utils/imageOptimizer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Получение всех номеров
exports.getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    logger.error('Ошибка в контроллере getRooms:', err);
    res.status(500).json({ message: err.message });
  }
};

// Получение номера по ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    res.json(room);
  } catch (err) {
    if (err.message === 'Номер не найден') {
      return res.status(404).json({ message: err.message });
    }
    logger.error('Ошибка в контроллере getRoomById:', err);
    res.status(500).json({ message: err.message });
  }
};

// Создание нового номера (только для админа)
exports.createRoom = async (req, res) => {
  try {
    const roomData = req.body;
    const room = await roomService.createRoom(roomData);
    res.status(201).json(room);
  } catch (err) {
    logger.error('Ошибка в контроллере createRoom:', err);
    res.status(400).json({ message: err.message });
  }
};

// Обновление номера (только для админа)
exports.updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (err) {
    if (err.message === 'Номер не найден') {
      return res.status(404).json({ message: err.message });
    }
    logger.error('Ошибка в контроллере updateRoom:', err);
    res.status(400).json({ message: err.message });
  }
};

// Удаление номера (только для админа)
exports.deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.json({ message: 'Номер успешно удален' });
  } catch (err) {
    if (err.message === 'Номер не найден') {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === 'Невозможно удалить номер с активными бронированиями') {
      return res.status(400).json({ message: err.message });
    }
    logger.error('Ошибка в контроллере deleteRoom:', err);
    res.status(500).json({ message: err.message });
  }
};

// Поиск доступных номеров на определенные даты
exports.getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await roomService.getAvailableRooms(req.query);
    res.json(availableRooms);
  } catch (err) {
    if (
      err.message === 'Необходимо указать даты заезда и выезда' ||
      err.message === 'Дата выезда должна быть позже даты заезда'
    ) {
      return res.status(400).json({ message: err.message });
    }
    logger.error('Ошибка в контроллере getAvailableRooms:', err);
    res.status(500).json({ message: err.message });
  }
};

// Обновляем функцию загрузки изображений для номера с поддержкой оптимизации
exports.uploadRoomImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверка существования номера
    const room = await roomService.getRoomById(id);

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
            quality: 85, // качество сжатия
          }
        );

        // Сохраняем информацию об оптимизированных версиях
        optimizedImages.push(optimizationResult);
      } catch (optimizationError) {
        logger.error(`Ошибка при оптимизации изображения: ${optimizationError.message}`, {
          error: optimizationError,
          filename: uniqueFilename,
        });
      }
    }

    // Обновляем массив изображений в базе данных
    let currentImages = room.images || [];
    if (typeof currentImages === 'string') {
      try {
        currentImages = JSON.parse(currentImages);
      } catch (_e) {
        currentImages = [];
      }
    }

    // Добавляем новые изображения
    const updatedImages = [...currentImages, ...uploadedImages];

    // Обновляем комнату с новыми изображениями
    await roomService.updateRoom(id, { images: updatedImages });

    // Формируем информацию о путях к оптимизированным изображениям для фронтенда
    const optimizedPaths = optimizedImages.map((result) => {
      const webpVersions = result.versions.webp.map((version) => ({
        width: version.width,
        path: `/uploads/rooms/optimized/${path.basename(version.optimizedPath)}`,
        size: version.optimizedSize,
      }));

      const jpgVersions = result.versions.jpg
        ? result.versions.jpg.map((version) => ({
            width: version.width,
            path: `/uploads/rooms/optimized/${path.basename(version.optimizedPath)}`,
            size: version.optimizedSize,
          }))
        : [];

      return {
        original: `/uploads/rooms/${path.basename(result.original)}`,
        webp: webpVersions,
        jpg: jpgVersions,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        room,
        uploadedImages,
        optimizedImages: optimizedPaths,
      },
    });
  } catch (err) {
    logger.error(`Ошибка при загрузке изображений: ${err.message}`, err);
    res.status(500).json({ message: req.tError('general.serverError') });
  }
};
