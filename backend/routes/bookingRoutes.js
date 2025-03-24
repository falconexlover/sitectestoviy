const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, isAdmin, isAdminOrManager } = require('../middlewares/authMiddleware');

// Маршруты для бронирований пользователя
router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/cancel/:id', auth, bookingController.cancelBooking);

// Маршруты только для админа/менеджера
router.get('/admin/all', auth, isAdminOrManager, bookingController.getAllBookings);
router.put('/admin/status/:id', auth, isAdminOrManager, bookingController.updateBookingStatus);

module.exports = router; 