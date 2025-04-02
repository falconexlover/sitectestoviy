import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { HomePage, HomePageImage, IHomePageContent, IHomePageImage } from '../models/HomePage';
import { AuthRequest } from '../middlewares/auth.middleware';
import dotenv from 'dotenv';

dotenv.config();

// Дефолтный контент для главной страницы
const DEFAULT_HOME_CONTENT: Partial<IHomePageContent> = {
  banner: {
    title: 'Добро пожаловать в «Лесной дворик»',
    subtitle: 'Гостиница, конференц-зал, сауна в одном комплексе в городе Жуковский',
    buttonText: 'Забронировать номер',
    backgroundImage: '/uploads/homepage/default-banner.jpg'
  },
  about: {
    title: 'О нашей гостинице',
    content: 'Наш гостиничный комплекс предлагает комфортное проживание, вкусное питание и дополнительные услуги для отдыха и деловых встреч. Мы находимся в тихом и живописном месте с удобной транспортной доступностью.',
    image: '/uploads/homepage/default-about.jpg'
  },
  rooms: {
    title: 'Наши номера',
    subtitle: 'Комфортное проживание для каждого гостя',
    roomsData: [
      {
        id: 'economy',
        title: 'Двухместный эконом',
        description: 'Уютный номер с двумя раздельными кроватями, отдельной ванной комнатой и всем необходимым для комфортного проживания.',
        price: 'от 2500 ₽',
        image: '/uploads/homepage/default-room-economy.jpg'
      },
      {
        id: 'family',
        title: 'Двухместный семейный',
        description: 'Просторный номер с двуспальной кроватью, идеально подходящий для семейных пар. В номере есть все необходимое для комфортного отдыха.',
        price: 'от 3500 ₽',
        image: '/uploads/homepage/default-room-family.jpg'
      },
      {
        id: 'multiple',
        title: 'Четырехместный эконом',
        description: 'Номер для группы друзей или семьи с четырьмя раздельными кроватями. Включает все необходимые удобства.',
        price: 'от 4500 ₽',
        image: '/uploads/homepage/default-room-multiple.jpg'
      }
    ]
  },
  services: {
    title: 'Услуги',
    subtitle: 'Дополнительные возможности для вашего комфорта',
    servicesData: [
      {
        id: 'sauna',
        title: 'Сауна',
        description: 'Расслабляющая сауна с комнатой отдыха и бассейном. Идеальное место для отдыха после трудного дня.',
        icon: '/uploads/homepage/default-service-sauna.jpg'
      },
      {
        id: 'conference',
        title: 'Конференц-зал',
        description: 'Просторный зал для проведения деловых встреч, конференций и презентаций, оборудованный всей необходимой техникой.',
        icon: '/uploads/homepage/default-service-conference.jpg'
      },
      {
        id: 'childrenParty',
        title: 'Проведение детских праздников',
        description: 'Организация и проведение развлекательных мероприятий для детей с аниматорами, украшением и праздничным угощением.',
        icon: '/uploads/homepage/default-service-party.jpg'
      }
    ]
  },
  contact: {
    title: 'Как нас найти',
    address: 'Московская область, г. Жуковский, ул. Нижегородская, д. 4',
    phone: ['8 (498) 483 19 41', '8 (915) 120 17 44'],
    email: 'info@lesnoydvorik.ru'
  }
};

/**
 * Инициализация контента главной страницы (создает дефолтный контент, если его нет)
 */
export const initializeHomePage = async (): Promise<void> => {
  try {
    const existingHomePage = await HomePage.findOne();
    
    if (!existingHomePage) {
      await HomePage.create(DEFAULT_HOME_CONTENT);
      console.log('Создан дефолтный контент главной страницы');
    }
  } catch (error) {
    console.error('Ошибка инициализации контента главной страницы:', error);
  }
};

/**
 * Получить контент главной страницы
 */
export const getHomePage = async (req: Request, res: Response): Promise<void> => {
  try {
    let homePage = await HomePage.findOne();
    
    // Если контента нет, создаем дефолтный
    if (!homePage) {
      homePage = await HomePage.create(DEFAULT_HOME_CONTENT);
    }
    
    res.status(200).json({
      success: true,
      data: homePage
    });
  } catch (error) {
    console.error('Ошибка получения контента главной страницы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения контента главной страницы'
    });
  }
};

/**
 * Обновить секцию главной страницы
 */
export const updateHomePageSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { section } = req.params;
    const updateData = req.body;
    
    // Проверяем, что секция существует
    if (!['banner', 'about', 'rooms', 'services', 'contact'].includes(section)) {
      res.status(400).json({
        success: false,
        message: 'Указана неверная секция'
      });
      return;
    }
    
    // Получаем текущий контент
    let homePage = await HomePage.findOne();
    
    // Если контента нет, создаем дефолтный
    if (!homePage) {
      homePage = await HomePage.create(DEFAULT_HOME_CONTENT);
    }
    
    // Обновляем указанную секцию
    const updatedHomePage = await HomePage.findByIdAndUpdate(
      homePage._id,
      { $set: { [section]: updateData } },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedHomePage
    });
  } catch (error) {
    console.error('Ошибка обновления секции главной страницы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка обновления секции главной страницы'
    });
  }
};

/**
 * Загрузить изображение для главной страницы
 */
export const uploadHomePageImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
      return;
    }
    
    const { type, roomId } = req.body;
    
    if (!type || !['banner', 'about', 'room', 'background'].includes(type)) {
      // Удаляем загруженный файл
      fs.unlinkSync(req.file.path);
      
      res.status(400).json({
        success: false,
        message: 'Тип изображения обязателен и должен быть одним из: banner, about, room, background'
      });
      return;
    }
    
    // Если это изображение номера, проверяем идентификатор
    if (type === 'room' && !roomId) {
      fs.unlinkSync(req.file.path);
      
      res.status(400).json({
        success: false,
        message: 'Для изображения номера необходимо указать roomId'
      });
      return;
    }
    
    // Сохраняем информацию об изображении
    const imagePath = `/uploads/homepage/${req.file.filename}`;
    
    const newImage = await HomePageImage.create({
      type,
      roomId: type === 'room' ? roomId : undefined,
      imagePath,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });
    
    // Обновляем соответствующую секцию на главной странице
    let homePage = await HomePage.findOne();
    
    // Если контента нет, создаем дефолтный
    if (!homePage) {
      homePage = await HomePage.create(DEFAULT_HOME_CONTENT);
    }
    
    // Обновляем URL изображения в соответствующей секции
    let updateQuery = {};
    
    switch (type) {
      case 'banner':
        updateQuery = { 'banner.backgroundImage': imagePath };
        break;
      case 'about':
        updateQuery = { 'about.image': imagePath };
        break;
      case 'room':
        if (roomId) {
          // Ищем номер в массиве и обновляем его изображение
          const roomIndex = homePage.rooms.roomsData.findIndex(room => room.id === roomId);
          if (roomIndex !== -1) {
            homePage.rooms.roomsData[roomIndex].image = imagePath;
            updateQuery = { 'rooms.roomsData': homePage.rooms.roomsData };
          }
        }
        break;
    }
    
    // Обновляем данные, если есть что обновлять
    if (Object.keys(updateQuery).length > 0) {
      await HomePage.findByIdAndUpdate(homePage._id, { $set: updateQuery });
    }
    
    res.status(201).json({
      success: true,
      data: newImage
    });
  } catch (error) {
    console.error('Ошибка загрузки изображения для главной страницы:', error);
    
    // Удаляем файл, если произошла ошибка
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка загрузки изображения для главной страницы'
    });
  }
}; 