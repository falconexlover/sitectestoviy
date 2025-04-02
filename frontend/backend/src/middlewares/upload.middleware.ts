import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Проверяем и создаем директории для загрузки файлов
const createUploadDirs = (): void => {
  const uploadDirs = [
    path.join(__dirname, '../../uploads/gallery'),
    path.join(__dirname, '../../uploads/rooms'),
    path.join(__dirname, '../../uploads/homepage')
  ];

  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Создаем директории при инициализации
createUploadDirs();

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    
    // Определяем путь для сохранения в зависимости от типа загрузки
    if (req.originalUrl.includes('/gallery')) {
      uploadPath = path.join(__dirname, '../../uploads/gallery');
    } else if (req.originalUrl.includes('/rooms')) {
      uploadPath = path.join(__dirname, '../../uploads/rooms');
    } else if (req.originalUrl.includes('/homepage')) {
      uploadPath = path.join(__dirname, '../../uploads/homepage');
    } else {
      uploadPath = path.join(__dirname, '../../uploads');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Создаем уникальное имя файла, сохраняя оригинальное расширение
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// Фильтр файлов (разрешаем только изображения)
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены только JPEG, PNG и WebP.'));
  }
};

// Настройка multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB максимальный размер
  }
}); 