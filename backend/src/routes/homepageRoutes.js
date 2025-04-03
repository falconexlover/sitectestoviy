const express = require('express');
const homepageController = require('../controllers/homepageController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/homepage - Получить данные главной страницы
router.get('/', homepageController.getHomepage);

// PUT /api/homepage/section/:section - Обновить секцию (требуется авторизация)
router.put('/section/:section', auth, homepageController.updateSection);

// POST /api/homepage/image - Загрузить изображение для секции (требуется авторизация)
router.post('/image', auth, upload.single('image'), homepageController.uploadImage);

module.exports = router; 