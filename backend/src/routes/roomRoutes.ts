import express from 'express';
import * as roomController from '../controllers/roomController';

const router = express.Router();

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);

export default router;