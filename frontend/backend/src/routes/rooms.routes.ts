import express from 'express';
import { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} from '../controllers/rooms.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Публичные маршруты
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Защищенные маршруты (только для админа)
router.post('/', authMiddleware, upload.single('image'), createRoom);
router.put('/:id', authMiddleware, upload.single('image'), updateRoom);
router.delete('/:id', authMiddleware, deleteRoom);

export default router; 