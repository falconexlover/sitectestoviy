const { Booking, Room, User } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Функция для отправки подтверждения бронирования
const sendBookingConfirmation = async (to, booking, room) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Подтверждение бронирования',
      html: `
        <h1>Подтверждение бронирования</h1>
        <p>Уважаемый гость,</p>
        <p>Ваше бронирование <strong>${room.name}</strong> успешно подтверждено.</p>
        <p><strong>Детали бронирования:</strong></p>
        <ul>
          <li>Номер: ${room.name}</li>
          <li>Дата заезда: ${new Date(booking.checkIn).toLocaleDateString()}</li>
          <li>Дата выезда: ${new Date(booking.checkOut).toLocaleDateString()}</li>
          <li>Количество гостей: ${booking.adults + booking.children}</li>
          <li>Итоговая стоимость: ${booking.totalPrice} руб.</li>
        </ul>
        <p>Спасибо за выбор нашего отеля!</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Ошибка отправки email:', err);
  }
};

// Создание нового бронирования
exports.createBooking = async (req, res) => {
  try {
    const { 
      roomId, 
      checkIn, 
      checkOut, 
      adults, 
      children, 
      specialRequests 
    } = req.body;
    
    // Проверяем наличие номера
    const room = await Room.findByPk(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ message: 'Номер недоступен для бронирования' });
    }
    
    // Проверяем валидность дат
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ 
        message: 'Дата выезда должна быть позже даты заезда' 
      });
    }
    
    // Проверяем, не занят ли номер на выбранные даты
    const existingBooking = await Booking.findOne({
      where: {
        RoomId: roomId,
        status: {
          [Op.in]: ['pending', 'confirmed']
        },
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            checkOut: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: checkInDate } },
              { checkOut: { [Op.gte]: checkOutDate } }
            ]
          }
        ]
      }
    });
    
    if (existingBooking) {
      return res.status(400).json({ 
        message: 'Номер уже забронирован на указанные даты' 
      });
    }
    
    // Рассчитываем количество дней
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Рассчитываем итоговую стоимость
    const totalPrice = room.price * days;
    
    // Создаем новое бронирование
    const booking = await Booking.create({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adults || 1,
      children: children || 0,
      totalPrice,
      specialRequests,
      status: 'pending',
      UserId: req.user.id,
      RoomId: roomId
    });
    
    // Получаем информацию о пользователе для отправки email
    const user = await User.findByPk(req.user.id);
    
    // Отправляем подтверждение на email
    await sendBookingConfirmation(user.email, booking, room);
    
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Получение всех бронирований пользователя
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ 
      where: { UserId: req.user.id },
      include: [{ model: Room }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение всех бронирований (только для админа)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ 
      include: [
        { model: Room },
        { model: User, attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение деталей бронирования
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Room },
        { model: User, attributes: { exclude: ['password'] } }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }
    
    // Проверяем, принадлежит ли бронирование пользователю или админ ли это
    if (booking.UserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление статуса бронирования (только для админа)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Некорректный статус' });
    }
    
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Room }, { model: User }]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }
    
    await booking.update({ status });
    
    // Если статус обновлен на "confirmed", отправляем email-подтверждение
    if (status === 'confirmed') {
      await sendBookingConfirmation(
        booking.User.email, 
        booking, 
        booking.Room
      );
    }
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Отмена бронирования пользователем
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }
    
    // Проверяем, принадлежит ли бронирование пользователю
    if (booking.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    // Проверяем, можно ли отменить бронирование
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ 
        message: 'Невозможно отменить бронирование в текущем статусе' 
      });
    }
    
    // Проверяем, не слишком ли поздно отменять (например, за 24 часа до заезда)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const timeUntilCheckIn = checkInDate - now;
    const hoursUntilCheckIn = timeUntilCheckIn / (1000 * 60 * 60);
    
    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({ 
        message: 'Бронирование нельзя отменить менее чем за 24 часа до заезда' 
      });
    }
    
    await booking.update({ status: 'canceled' });
    
    res.json({ message: 'Бронирование успешно отменено', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 