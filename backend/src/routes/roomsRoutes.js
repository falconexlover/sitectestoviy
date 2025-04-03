const express = require('express');
const roomsController = require('../controllers/roomsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/rooms - Получить все номера
router.get('/', roomsController.getAllRooms);

// GET /api/rooms/:id - Получить номер по ID
router.get('/:id', roomsController.getRoomById);

// POST /api/rooms - Создать новый номер (требуется авторизация)
router.post('/', auth, upload.single('mainImage'), roomsController.createRoom);

// PUT /api/rooms/:id - Обновить номер (требуется авторизация)
router.put('/:id', auth, upload.single('mainImage'), roomsController.updateRoom);

// DELETE /api/rooms/:id - Удалить номер (требуется авторизация)
router.delete('/:id', auth, roomsController.deleteRoom);

module.exports = router; 