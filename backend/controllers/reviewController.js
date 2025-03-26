const { Review, User, Room } = require('../models');
const logger = require('../utils/logger');

// Получение всех отзывов к номеру
exports.getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Проверка существования номера
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        message: req.tError('booking.roomNotFound'),
      });
    }

    // Получение отзывов с информацией о пользователе
    const reviews = await Review.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Формирование статистики по отзывам
    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    // Если есть категории оценок, считаем средние по ним
    if (reviews.some((r) => r.cleanlinessRating)) {
      const categoryReviews = reviews.filter((r) => r.cleanlinessRating);
      const count = categoryReviews.length;

      if (count > 0) {
        stats.categoryRatings = {
          cleanliness:
            categoryReviews.reduce((acc, r) => acc + (r.cleanlinessRating || 0), 0) / count,
          service: categoryReviews.reduce((acc, r) => acc + (r.serviceRating || 0), 0) / count,
          comfort: categoryReviews.reduce((acc, r) => acc + (r.comfortRating || 0), 0) / count,
          location: categoryReviews.reduce((acc, r) => acc + (r.locationRating || 0), 0) / count,
          value: categoryReviews.reduce((acc, r) => acc + (r.valueRating || 0), 0) / count,
        };
      }
    }

    res.json({ reviews, stats });
  } catch (err) {
    logger.error(`Ошибка при получении отзывов: ${err.message}`, err);
    res.status(500).json({ message: req.tError('general.serverError') });
  }
};

// Создание нового отзыва
exports.createReview = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Проверка существования номера
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        message: req.tError('booking.roomNotFound'),
      });
    }

    // Проверка, есть ли у пользователя завершенное бронирование для этого номера
    // Для разработки можно отключить, но в продакшн нужно включить для валидации отзывов
    /* 
    const hasBooking = await Booking.findOne({
      where: {
        userId,
        roomId,
        status: 'completed'
      }
    });
    
    if (!hasBooking) {
      return res.status(403).json({ 
        message: req.t('errors:validation.reviewNotAllowed') 
      });
    }
    */

    // Проверка, не оставлял ли пользователь уже отзыв
    const existingReview = await Review.findOne({
      where: { userId, roomId },
    });

    if (existingReview) {
      return res.status(400).json({
        message: req.t('errors:validation.reviewAlreadyExists'),
      });
    }

    // Создание отзыва
    const review = await Review.create({
      ...req.body,
      userId,
      roomId,
    });

    // Получение полного отзыва с данными пользователя
    const fullReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });

    res.status(201).json(fullReview);
  } catch (err) {
    logger.error(`Ошибка при создании отзыва: ${err.message}`, err);

    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: req.tError('general.validationError'),
        errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }

    res.status(500).json({ message: req.tError('general.serverError') });
  }
};

// Обновление отзыва
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Проверка существования отзыва
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        message: req.t('errors:reviews.reviewNotFound'),
      });
    }

    // Проверка прав на редактирование (только автор или админ)
    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        message: req.tError('auth.noPermission'),
      });
    }

    // Обновление данных отзыва
    await review.update(req.body);

    // Получение обновленного отзыва с данными пользователя
    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });

    res.json(updatedReview);
  } catch (err) {
    logger.error(`Ошибка при обновлении отзыва: ${err.message}`, err);

    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: req.tError('general.validationError'),
        errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }

    res.status(500).json({ message: req.tError('general.serverError') });
  }
};

// Удаление отзыва
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Проверка существования отзыва
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        message: req.t('errors:reviews.reviewNotFound'),
      });
    }

    // Проверка прав на удаление (только автор или админ)
    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        message: req.tError('auth.noPermission'),
      });
    }

    // Удаление отзыва
    await review.destroy();

    res.json({ message: req.t('reviews.deleted') });
  } catch (err) {
    logger.error(`Ошибка при удалении отзыва: ${err.message}`, err);
    res.status(500).json({ message: req.tError('general.serverError') });
  }
};

// Ответ на отзыв (только для администраторов и менеджеров)
exports.respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    // Проверка существования отзыва
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        message: req.t('errors:reviews.reviewNotFound'),
      });
    }

    // Проверка прав (только админ или менеджер)
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        message: req.tError('auth.noPermission'),
      });
    }

    // Обновление отзыва с ответом
    await review.update({
      response,
      responseDate: new Date(),
    });

    // Получение обновленного отзыва
    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });

    res.json(updatedReview);
  } catch (err) {
    logger.error(`Ошибка при ответе на отзыв: ${err.message}`, err);
    res.status(500).json({ message: req.tError('general.serverError') });
  }
};
