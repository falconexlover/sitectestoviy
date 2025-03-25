/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: API для получения аналитических данных (только для админов и менеджеров)
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, adminOnly, staffOnly } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Получение общей статистики
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Общая статистика (общее количество бронирований, доход, средняя загрузка)
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/overall', auth, staffOnly, analyticsController.getOverallStats);

/**
 * @swagger
 * /api/analytics/period:
 *   get:
 *     summary: Получение статистики за период
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Начало периода (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Конец периода (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Статистика за указанный период
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/period', auth, staffOnly, analyticsController.getStatsByPeriod);

/**
 * @swagger
 * /api/analytics/forecast:
 *   get:
 *     summary: Получение прогноза загрузки
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *         description: Количество месяцев для прогноза (по умолчанию 3)
 *     responses:
 *       200:
 *         description: Прогноз загрузки на указанный период
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/forecast', auth, staffOnly, analyticsController.getOccupancyForecast);

/**
 * @swagger
 * /api/analytics/popular-rooms:
 *   get:
 *     summary: Получение списка самых популярных номеров
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Ограничение количества возвращаемых номеров (по умолчанию 10)
 *     responses:
 *       200:
 *         description: Список популярных номеров с количеством бронирований
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/popular-rooms', auth, staffOnly, analyticsController.getPopularRooms);

module.exports = router; 