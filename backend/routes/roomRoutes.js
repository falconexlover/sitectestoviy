const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { auth, isAdmin } = require('../middlewares/authMiddleware');

// Маршруты для номеров
router.get('/', roomController.getRooms);
router.get('/available', roomController.getAvailableRooms);
router.get('/:id', roomController.getRoomById);

// Защищенные маршруты (только для админа)
router.post('/', auth, isAdmin, roomController.createRoom);
router.put('/:id', auth, isAdmin, roomController.updateRoom);
router.delete('/:id', auth, isAdmin, roomController.deleteRoom);

module.exports = router; 