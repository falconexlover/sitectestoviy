/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API для управления номерами гостиницы
 */

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { auth, adminOnly } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Получение списка всех номеров
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Список номеров успешно получен
 */
router.get('/', roomController.getRooms);

/**
 * @swagger
 * /api/rooms/available:
 *   get:
 *     summary: Получение списка доступных для бронирования номеров
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: checkIn
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Дата заезда (YYYY-MM-DD)
 *       - in: query
 *         name: checkOut
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Дата выезда (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Список доступных номеров
 *       400:
 *         description: Ошибка в запросе
 */
router.get('/available', roomController.getAvailableRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Получение информации о конкретном номере
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID номера
 *     responses:
 *       200:
 *         description: Информация о номере
 *       404:
 *         description: Номер не найден
 */
router.get('/:id', roomController.getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Создание нового номера
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - type
 *               - pricePerNight
 *             properties:
 *               number:
 *                 type: string
 *                 description: Номер комнаты
 *               type:
 *                 type: string
 *                 description: Тип номера (например, "Стандарт", "Люкс")
 *               pricePerNight:
 *                 type: number
 *                 description: Цена за ночь
 *               capacity:
 *                 type: integer
 *                 description: Вместимость (человек)
 *               description:
 *                 type: string
 *                 description: Описание номера
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Особенности номера
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URL изображений номера
 *     responses:
 *       201:
 *         description: Номер успешно создан
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для выполнения операции
 */
router.post('/', auth, adminOnly, roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Обновление информации о номере
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID номера
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *               type:
 *                 type: string
 *               pricePerNight:
 *                 type: number
 *               capacity:
 *                 type: integer
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Номер успешно обновлен
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для выполнения операции
 *       404:
 *         description: Номер не найден
 */
router.put('/:id', auth, adminOnly, roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Удаление номера
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID номера
 *     responses:
 *       200:
 *         description: Номер успешно удален
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для выполнения операции
 *       404:
 *         description: Номер не найден
 */
router.delete('/:id', auth, adminOnly, roomController.deleteRoom);

module.exports = router; 