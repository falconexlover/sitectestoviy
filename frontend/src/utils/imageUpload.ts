import { useState } from 'react';

/**
 * Интерфейс для загруженного изображения
 */
export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  category: string;
  title: string;
  description: string;
  createdAt: Date;
}

/**
 * Хук для управления загрузкой изображений
 */
export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Функция для загрузки изображений
   */
  const uploadImages = async (
    files: File[], 
    category: string, 
    title: string = '', 
    description: string = ''
  ) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const newImages: UploadedImage[] = [];
      
      for (const file of files) {
        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
          throw new Error(`Файл ${file.name} не является изображением`);
        }
        
        // Создание URL для предпросмотра
        const imageUrl = URL.createObjectURL(file);
        
        // В реальном проекте здесь будет загрузка на сервер
        // Сейчас просто добавляем в локальный стейт
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          file,
          url: imageUrl,
          category,
          title: title || file.name,
          description,
          createdAt: new Date()
        };
        
        newImages.push(newImage);
      }
      
      setUploadedImages(prev => [...prev, ...newImages]);
      return newImages;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке изображений');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Функция для удаления изображения
   */
  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Освобождаем объектные URL, чтобы избежать утечек памяти
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return filtered;
    });
  };

  /**
   * Функция для обновления метаданных изображения
   */
  const updateImageDetails = (
    id: string, 
    details: Partial<Pick<UploadedImage, 'category' | 'title' | 'description'>>
  ) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, ...details } : img
      )
    );
  };

  return {
    uploadedImages,
    isUploading,
    uploadError,
    uploadImages,
    removeImage,
    updateImageDetails
  };
};

/**
 * Функция для сохранения изображения на сервере
 * В реальном проекте эта функция будет отправлять файлы на бэкенд
 */
export const saveImageToServer = async (image: File, category: string): Promise<string> => {
  // Здесь будет реальная логика загрузки на сервер
  // Сейчас просто имитируем асинхронную загрузку
  return new Promise((resolve) => {
    setTimeout(() => {
      // Возвращаем путь к изображению в публичной папке
      // В реальности это будет URL, возвращенный сервером
      resolve(`/images/gallery/${category.toLowerCase()}/${image.name}`);
    }, 1000);
  });
}; 