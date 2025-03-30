const logger = require('../utils/logger');
const { Booking } = require('../models');

// Создаем заглушку или настоящий клиент Stripe в зависимости от наличия ключа API
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  logger.info('Stripe API инициализирован');
} else {
  logger.warn('STRIPE_SECRET_KEY не найден в окружении. Платежная система работает в ТЕСТОВОМ режиме');
  // Создаем мок-объект для разработки
  stripe = {
    paymentIntents: {
      create: async (options) => {
        logger.info(`[ТЕСТ] Создано платежное намерение: ${JSON.stringify(options)}`);
        return {
          id: `pi_mock_${Date.now()}`,
          client_secret: `pi_mock_secret_${Date.now()}`,
          amount: options.amount,
          currency: options.currency,
          metadata: options.metadata,
          status: 'requires_payment_method'
        };
      },
      retrieve: async (id) => {
        logger.info(`[ТЕСТ] Получено платежное намерение: ${id}`);
        return {
          id,
          status: 'succeeded',
          metadata: {
            bookingId: id.split('_').pop(),
          }
        };
      }
    }
  };
}

// Создание платежного намерения
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Идентификатор бронирования обязателен' });
    }

    // Получаем бронирование
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Бронирование уже оплачено' });
    }

    // Создаем платежное намерение в Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Конвертируем в копейки/центы
      currency: 'rub',
      metadata: {
        bookingId: booking.id.toString(),
        userId: req.user.id.toString(),
      },
    });

    // Возвращаем клиентский секрет
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalPrice,
    });
  } catch (err) {
    logger.error(`Ошибка при создании платежного намерения: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Обработка успешной оплаты
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Проверяем статус платежа в Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Платеж не завершен' });
    }

    const bookingId = paymentIntent.metadata.bookingId;

    // Обновляем статус оплаты в бронировании
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    await booking.update({
      paymentStatus: 'paid',
      paymentMethod: 'card',
    });

    res.json({ message: 'Оплата успешно завершена', booking });
  } catch (err) {
    logger.error(`Ошибка при обработке успешного платежа: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Получение информации о статусе оплаты
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверяем, что пользователь имеет право на просмотр
    if (
      booking.UserId !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'manager'
    ) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json({
      bookingId: booking.id,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
    });
  } catch (err) {
    logger.error(`Ошибка при получении статуса оплаты: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
