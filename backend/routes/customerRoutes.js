const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { auth, isAdmin, isAdminOrManager } = require('../middlewares/authMiddleware');

// Маршруты для управления клиентами (только для админа)
router.get('/', auth, isAdminOrManager, customerController.getAllCustomers);
router.get('/search', auth, isAdminOrManager, customerController.searchCustomers);
router.get('/:id', auth, isAdminOrManager, customerController.getCustomerById);
router.get('/:id/stats', auth, isAdminOrManager, customerController.getCustomerStats);

module.exports = router; 