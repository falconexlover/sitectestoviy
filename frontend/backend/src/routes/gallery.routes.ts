import express from 'express';
import { 
  getAllImages, 
  getImageById, 
  uploadImage, 
  updateImage, 
  deleteImage 
} from '../controllers/gallery.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Публичные маршруты
router.get('/', getAllImages);
router.get('/:id', getImageById);

// Защищенные маршруты (только для админа)
router.post('/', authMiddleware, upload.single('image'), uploadImage);
router.put('/:id', authMiddleware, updateImage);
router.delete('/:id', authMiddleware, deleteImage);

export default router; 