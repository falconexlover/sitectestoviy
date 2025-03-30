/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API для управления бронированиями
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middlewares/authMiddleware');

router.use(auth);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Создание нового бронирования
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - checkIn
 *               - checkOut
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID номера
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 description: Дата заезда
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 description: Дата выезда
 *               adults:
 *                 type: integer
 *                 description: Количество взрослых
 *               children:
 *                 type: integer
 *                 description: Количество детей
 *               specialRequests:
 *                 type: string
 *                 description: Особые пожелания
 *     responses:
 *       201:
 *         description: Бронирование успешно создано
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Номер не найден или недоступен
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Получение списка бронирований пользователя
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список бронирований пользователя
 *       401:
 *         description: Не авторизован
 */
router.get('/', bookingController.getUserBookings);

/**
 * @swagger
 * /api/bookings/admin/all:
 *   get:
 *     summary: Получение списка всех бронирований (только для админов/менеджеров)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Фильтр по статусу бронирования
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Фильтр по дате с (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Фильтр по дату по (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Список всех бронирований
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/admin/all', bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Получение информации о конкретном бронировании
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID бронирования
 *     responses:
 *       200:
 *         description: Информация о бронировании
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа к бронированию
 *       404:
 *         description: Бронирование не найдено
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Отмена бронирования пользователем
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID бронирования
 *     responses:
 *       200:
 *         description: Бронирование успешно отменено
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для отмены бронирования
 *       404:
 *         description: Бронирование не найдено
 *       400:
 *         description: Невозможно отменить (например, прошла дата заезда)
 */
router.put('/:id/cancel', bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/admin/status/{id}:
 *   put:
 *     summary: Обновление статуса бронирования (только для админов/менеджеров)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID бронирования
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 description: Новый статус бронирования
 *               notes:
 *                 type: string
 *                 description: Примечания к изменению статуса
 *     responses:
 *       200:
 *         description: Статус бронирования успешно обновлен
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для изменения статуса
 *       404:
 *         description: Бронирование не найдено
 */
router.put('/admin/status/:id', bookingController.updateBookingStatus);

/**
 * @swagger
 * /api/bookings/availability:
 *   get:
 *     summary: Проверка доступности номера на указанные даты
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID номера
 *       - in: query
 *         name: checkIn
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Дата заезда
 *       - in: query
 *         name: checkOut
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Дата выезда
 *     responses:
 *       200:
 *         description: Информация о доступности номера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: Доступен ли номер на указанные даты
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 */
router.get('/availability', bookingController.checkAvailability);

/**
 * @swagger
 * /api/bookings/stats:
 *   get:
 *     summary: Получение статистики по бронированиям (только для админов/менеджеров)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика по бронированиям
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/stats', bookingController.getBookingStats);

module.exports = router;
