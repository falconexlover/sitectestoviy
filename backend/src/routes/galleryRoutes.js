const express = require('express');
const galleryController = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/gallery - Получить все изображения
router.get('/', galleryController.getAllImages);

// GET /api/gallery/:id - Получить изображение по ID
router.get('/:id', galleryController.getImageById);

// POST /api/gallery - Загрузить новое изображение (требуется авторизация)
router.post('/', auth, upload.single('image'), galleryController.uploadImage);

// PUT /api/gallery/:id - Обновить информацию об изображении (требуется авторизация)
router.put('/:id', auth, galleryController.updateImage);

// DELETE /api/gallery/:id - Удалить изображение (требуется авторизация)
router.delete('/:id', auth, galleryController.deleteImage);

module.exports = router; 