const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, isAdmin, isAdminOrManager } = require('../middlewares/authMiddleware');

// Маршруты для аналитики (только для админа)
router.get('/overall', auth, isAdminOrManager, analyticsController.getOverallStats);
router.get('/period', auth, isAdminOrManager, analyticsController.getStatsByPeriod);
router.get('/forecast', auth, isAdminOrManager, analyticsController.getOccupancyForecast);
router.get('/popular-rooms', auth, isAdminOrManager, analyticsController.getPopularRooms);

module.exports = router; 