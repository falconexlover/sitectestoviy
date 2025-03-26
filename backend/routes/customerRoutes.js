/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API для управления клиентами (только для админов и менеджеров)
 */

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { auth } = require('../middlewares/authMiddleware');

router.use(auth);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Получение списка всех клиентов
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список клиентов
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/', customerController.getAllCustomers);

/**
 * @swagger
 * /api/customers/search:
 *   get:
 *     summary: Поиск клиентов по различным параметрам
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Поисковый запрос (имя, email, телефон)
 *     responses:
 *       200:
 *         description: Результаты поиска
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 */
router.get('/search', customerController.searchCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Получение информации о конкретном клиенте
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID клиента
 *     responses:
 *       200:
 *         description: Информация о клиенте
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 *       404:
 *         description: Клиент не найден
 */
router.get('/:id', customerController.getCustomerById);

/**
 * @swagger
 * /api/customers/{id}/stats:
 *   get:
 *     summary: Получение статистики по клиенту
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID клиента
 *     responses:
 *       200:
 *         description: Статистика клиента (количество бронирований, общая сумма и т.д.)
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для доступа
 *       404:
 *         description: Клиент не найден
 */
router.get('/:id/stats', customerController.getCustomerStats);

router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
