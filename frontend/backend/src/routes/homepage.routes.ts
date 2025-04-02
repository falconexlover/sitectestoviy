import express from 'express';
import {
  getHomePage,
  updateHomePageSection,
  uploadHomePageImage
} from '../controllers/homepage.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Публичный маршрут - получение контента главной страницы
router.get('/', getHomePage);

// Защищенные маршруты - только для админа
router.put('/section/:section', authMiddleware, updateHomePageSection);
router.post('/image', authMiddleware, upload.single('image'), uploadHomePageImage);

export default router; 