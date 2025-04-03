const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Вход в систему
router.post('/login', authController.login);

// GET /api/auth/check - Проверка аутентификации
router.get('/check', auth, authController.checkAuth);

module.exports = router; 