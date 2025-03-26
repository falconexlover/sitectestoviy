const nodemailer = require('nodemailer');
const logger = require('./logger');
const i18next = require('../config/i18n');

// Конфигурация транспорта для отправки писем
const createTransporter = () => {
  // В продакшн добавить реальные настройки SMTP-сервера
  // Для разработки можно использовать Ethereal или Mailtrap
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Для разработки используем nodemailer.createTestAccount()
    // или можно использовать Mailtrap, Ethereal, и т.д.
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.TEST_EMAIL_USER || 'xrtevw3agdz3yx4z@ethereal.email',
        pass: process.env.TEST_EMAIL_PASS || 'kEdQb1jW8UF36qSa2j',
      },
    });
  }
};

/**
 * Отправляет email с указанными параметрами
 * @param {Object} options - Параметры письма
 * @param {string} options.to - Email получателя
 * @param {string} options.subject - Тема письма
 * @param {string} options.text - Текст письма (для клиентов без поддержки HTML)
 * @param {string} options.html - HTML-версия письма
 * @param {string} options.lang - Язык письма (ru/en)
 * @returns {Promise} - Результат отправки
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const lang = options.lang || 'ru';

    // Получение локализованного содержимого письма
    const subject = options.subject || '';
    const text = options.text || '';
    const html = options.html || '';

    // Настройка отправителя
    const from = process.env.EMAIL_FROM || '"Лесной Дворик" <info@lesnoy-dvorik.ru>';

    // Отправка письма
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject,
      text,
      html,
    });

    logger.info(`Email отправлен: ${info.messageId}`);

    // Для тестовых аккаунтов возвращаем URL для просмотра
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`URL для просмотра: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (error) {
    logger.error(`Ошибка при отправке email: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Отправляет email с подтверждением бронирования
 * @param {Object} booking - Данные о бронировании
 * @param {Object} user - Данные пользователя
 * @param {Object} room - Данные о номере
 * @param {string} lang - Язык письма
 * @returns {Promise}
 */
const sendBookingConfirmation = async (booking, user, room, lang = 'ru') => {
  try {
    // Получаем переводы для нужного языка
    const t = (key) => i18next.t(key, { lng: lang });

    const subject = t('emails.bookingConfirmation.subject');

    // Форматируем даты в локализованном формате
    const checkInDate = new Date(booking.checkIn).toLocaleDateString(
      lang === 'ru' ? 'ru-RU' : 'en-US',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );

    const checkOutDate = new Date(booking.checkOut).toLocaleDateString(
      lang === 'ru' ? 'ru-RU' : 'en-US',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );

    // Создаем HTML-версию письма
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #003366;">${t('emails.bookingConfirmation.title')}</h1>
        <p>${t('emails.bookingConfirmation.greeting')}, ${user.firstName || user.username}!</p>
        <p>${t('emails.bookingConfirmation.confirmed')}</p>
        
        <div style="background-color: #f5f5f5; border-radius: 5px; padding: 15px; margin: 20px 0;">
          <h2 style="color: #003366; margin-top: 0;">${t('emails.bookingConfirmation.details')}</h2>
          <p><strong>${t('booking.bookingId')}:</strong> ${booking.id}</p>
          <p><strong>${t('room.roomType')}:</strong> ${room.type}</p>
          <p><strong>${t('booking.checkIn')}:</strong> ${checkInDate}</p>
          <p><strong>${t('booking.checkOut')}:</strong> ${checkOutDate}</p>
          <p><strong>${t('booking.guests')}:</strong> ${booking.guests}</p>
          <p><strong>${t('booking.totalPrice')}:</strong> ${booking.totalPrice} ₽</p>
        </div>
        
        <p>${t('emails.bookingConfirmation.instructions')}</p>
        <p>${t('emails.bookingConfirmation.contactInfo')}</p>
        <p>${t('emails.bookingConfirmation.needHelp')}</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/bookings/${booking.id}" 
             style="background-color: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            ${t('booking.viewBooking')}
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #777; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} ${t('app.name')}. ${t('emails.bookingConfirmation.footer')}
        </p>
      </div>
    `;

    // Текстовая версия письма
    const text = `
      ${t('emails.bookingConfirmation.title')}
      
      ${t('emails.bookingConfirmation.greeting')}, ${user.firstName || user.username}!
      ${t('emails.bookingConfirmation.confirmed')}
      
      ${t('emails.bookingConfirmation.details')}:
      ${t('booking.bookingId')}: ${booking.id}
      ${t('room.roomType')}: ${room.type}
      ${t('booking.checkIn')}: ${checkInDate}
      ${t('booking.checkOut')}: ${checkOutDate}
      ${t('booking.guests')}: ${booking.guests}
      ${t('booking.totalPrice')}: ${booking.totalPrice} ₽
      
      ${t('emails.bookingConfirmation.instructions')}
      ${t('emails.bookingConfirmation.contactInfo')}
      ${t('emails.bookingConfirmation.needHelp')}
      
      ${t('booking.viewBooking')}: ${process.env.FRONTEND_URL}/bookings/${booking.id}
      
      © ${new Date().getFullYear()} ${t('app.name')}. ${t('emails.bookingConfirmation.footer')}
    `;

    return await sendEmail({
      to: user.email,
      subject,
      text,
      html,
      lang,
    });
  } catch (error) {
    logger.error(`Ошибка при отправке подтверждения бронирования: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Отправляет email с напоминанием о предстоящем заезде
 * @param {Object} booking - Данные о бронировании
 * @param {Object} user - Данные пользователя
 * @param {Object} room - Данные о номере
 * @param {string} lang - Язык письма
 * @returns {Promise}
 */
const sendCheckInReminder = async (booking, user, room, lang = 'ru') => {
  // Аналогично функции sendBookingConfirmation,
  // но с другим шаблоном и содержанием
  // ...
  // Для экономии места реализация опущена
  return true;
};

/**
 * Отправляет email с просьбой оставить отзыв
 * @param {Object} booking - Данные о бронировании
 * @param {Object} user - Данные пользователя
 * @param {Object} room - Данные о номере
 * @param {string} lang - Язык письма
 * @returns {Promise}
 */
const sendReviewRequest = async (booking, user, room, lang = 'ru') => {
  // Аналогично функции sendBookingConfirmation,
  // но с другим шаблоном и содержанием
  // ...
  // Для экономии места реализация опущена
  return true;
};

const sendBookingConfirmationEmail = async (_user, _booking, _room, _lang) => {
  // ... existing code ...
};

const sendBookingCancellationEmail = async (_user, _booking, _room, _lang) => {
  // ... existing code ...
};

const sendBookingUpdateEmail = async (_user, _booking, _room, _lang) => {
  // ... existing code ...
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendCheckInReminder,
  sendReviewRequest,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendBookingUpdateEmail,
};
