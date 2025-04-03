const Homepage = require('../models/Homepage');
const fs = require('fs');
const path = require('path');

// Получить данные главной страницы
exports.getHomepage = async (req, res) => {
  try {
    let homepage = await Homepage.findOne();
    
    // Если данных нет, создаем базовую структуру
    if (!homepage) {
      homepage = await new Homepage({
        hero: {
          title: 'Санаторий-профилакторий «Лесной дворик»',
          subtitle: 'Отдых среди природы',
          content: 'Мы предлагаем комфортный отдых в экологически чистом месте с видом на лес и реку.',
          buttonText: 'Забронировать',
          buttonLink: '/booking',
          isVisible: true
        },
        about: {
          title: 'О нас',
          content: 'Санаторий-профилакторий «Лесной дворик» - уютное место для отдыха всей семьей.',
          isVisible: true
        },
        features: [
          {
            title: 'Чистый воздух',
            content: 'Расположение вдали от города и промышленных объектов',
            isVisible: true
          },
          {
            title: 'Уютные номера',
            content: 'Комфортабельные номера различных категорий',
            isVisible: true
          },
          {
            title: 'Питание',
            content: 'Вкусная и здоровая еда из экологически чистых продуктов',
            isVisible: true
          }
        ],
        gallery: {
          title: 'Галерея',
          subtitle: 'Взгляните на наш санаторий',
          buttonText: 'Смотреть все фото',
          isVisible: true
        },
        rooms: {
          title: 'Номера',
          subtitle: 'Выберите подходящий вариант размещения',
          buttonText: 'Все номера',
          isVisible: true
        },
        testimonials: {
          title: 'Отзывы',
          subtitle: 'Что говорят наши гости',
          items: [
            {
              name: 'Анна',
              text: 'Отличное место для отдыха. Чистый воздух, красивая природа и приветливый персонал.',
              rating: 5
            }
          ],
          isVisible: true
        },
        contact: {
          title: 'Контакты',
          content: 'Свяжитесь с нами для бронирования и получения информации.',
          isVisible: true
        }
      }).save();
    }
    
    res.json(homepage);
  } catch (error) {
    console.error('Ошибка при получении данных главной страницы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить секцию главной страницы
exports.updateSection = async (req, res) => {
  try {
    let homepage = await Homepage.findOne();
    
    // Если данных нет, создаем базовую структуру
    if (!homepage) {
      homepage = await new Homepage().save();
    }
    
    const { section } = req.params;
    const updates = req.body;
    
    // Проверяем, существует ли указанная секция
    if (!homepage[section] && section !== 'features') {
      return res.status(404).json({ message: 'Указанная секция не найдена' });
    }
    
    // Специальная обработка для массива features
    if (section === 'features') {
      if (Array.isArray(updates)) {
        homepage.features = updates;
      } else if (updates.index !== undefined && updates.data) {
        const index = parseInt(updates.index);
        
        // Если указан существующий индекс, обновляем элемент
        if (index >= 0 && index < homepage.features.length) {
          homepage.features[index] = { 
            ...homepage.features[index].toObject(), 
            ...updates.data 
          };
        } 
        // Если индекс = длине массива, добавляем новый элемент
        else if (index === homepage.features.length) {
          homepage.features.push(updates.data);
        }
        // Если индекс за пределами, возвращаем ошибку
        else {
          return res.status(400).json({ message: 'Неверный индекс для массива features' });
        }
      }
    }
    // Для остальных секций просто обновляем данные
    else {
      homepage[section] = {
        ...homepage[section].toObject(),
        ...updates
      };
    }
    
    await homepage.save();
    
    res.json(homepage);
  } catch (error) {
    console.error('Ошибка при обновлении секции:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Загрузить изображение для секции
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Нет загруженного изображения' });
    }
    
    const { section } = req.body;
    
    if (!section) {
      return res.status(400).json({ message: 'Не указана секция для изображения' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    let homepage = await Homepage.findOne();
    
    // Если данных нет, создаем базовую структуру
    if (!homepage) {
      homepage = await new Homepage().save();
    }
    
    // Проверка секции и обновление URL изображения
    if (section === 'features') {
      const index = req.body.index ? parseInt(req.body.index) : -1;
      
      if (index >= 0 && index < homepage.features.length) {
        // Если было старое изображение, удаляем его
        if (homepage.features[index].imageUrl) {
          const oldImagePath = path.join(__dirname, '../..', homepage.features[index].imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        homepage.features[index].imageUrl = imageUrl;
      } else {
        return res.status(400).json({ message: 'Неверный индекс для массива features' });
      }
    } else if (homepage[section]) {
      // Если было старое изображение, удаляем его
      if (homepage[section].imageUrl) {
        const oldImagePath = path.join(__dirname, '../..', homepage[section].imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      homepage[section].imageUrl = imageUrl;
    } else {
      return res.status(404).json({ message: 'Указанная секция не найдена' });
    }
    
    await homepage.save();
    
    res.json({
      imageUrl,
      section,
      message: 'Изображение успешно загружено'
    });
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 