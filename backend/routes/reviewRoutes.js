const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, restrictTo } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { body } = require('express-validator');

// Валидация для отзывов
const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Оценка должна быть от 1 до 5'),
  body('comment')
    .isString()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Комментарий должен содержать от 2 до 1000 символов'),
  body('cleanlinessRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка чистоты должна быть от 1 до 5'),
  body('serviceRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка сервиса должна быть от 1 до 5'),
  body('comfortRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка комфорта должна быть от 1 до 5'),
  body('locationRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка расположения должна быть от 1 до 5'),
  body('valueRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка соотношения цена-качество должна быть от 1 до 5'),
  body('pros')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Достоинства должны содержать не более 500 символов'),
  body('cons')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Недостатки должны содержать не более 500 символов'),
];

const responseValidation = [
  body('response')
    .isString()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Ответ должен содержать от 2 до 1000 символов'),
];

// Получение всех отзывов к номеру (публичный доступ)
router.get('/rooms/:roomId/reviews', reviewController.getRoomReviews);

// Создание отзыва (только для авторизованных пользователей)
router.post(
  '/rooms/:roomId/reviews',
  auth,
  reviewValidation,
  validate,
  reviewController.createReview
);

// Обновление отзыва (только для автора или администратора)
router.put(
  '/reviews/:reviewId',
  auth,
  reviewValidation,
  validate,
  reviewController.updateReview
);

// Удаление отзыва (только для автора или администратора)
router.delete('/reviews/:reviewId', auth, reviewController.deleteReview);

// Ответ на отзыв (только для администраторов и менеджеров)
router.post(
  '/reviews/:reviewId/respond',
  auth,
  restrictTo('admin', 'manager'),
  responseValidation,
  validate,
  reviewController.respondToReview
);

module.exports = router;
