/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API для обработки платежей
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Создание платежного намерения Stripe
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 description: ID бронирования для оплаты
 *     responses:
 *       200:
 *         description: Платежное намерение успешно создано
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Бронирование не найдено
 */
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/payments/payment-success:
 *   post:
 *     summary: Обработка успешной оплаты
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 description: ID платежного намерения Stripe
 *     responses:
 *       200:
 *         description: Оплата успешно обработана
 *       400:
 *         description: Ошибка в запросе
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Бронирование не найдено
 */
router.post('/payment-success', auth, paymentController.handlePaymentSuccess);

/**
 * @swagger
 * /api/payments/status/{bookingId}:
 *   get:
 *     summary: Получение статуса оплаты бронирования
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID бронирования
 *     responses:
 *       200:
 *         description: Статус оплаты
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 *       404:
 *         description: Бронирование не найдено
 */
router.get('/status/:bookingId', auth, paymentController.getPaymentStatus);

module.exports = router; 