/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - checkIn
 *         - checkOut
 *         - adults
 *         - totalPrice
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор бронирования
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Дата и время заезда
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Дата и время выезда
 *         adults:
 *           type: integer
 *           description: Количество взрослых
 *         children:
 *           type: integer
 *           description: Количество детей
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Общая стоимость бронирования
 *         specialRequests:
 *           type: string
 *           description: Особые пожелания гостя
 *         status:
 *           type: string
 *           enum: [pending, confirmed, canceled, completed]
 *           description: Статус бронирования
 *         paymentStatus:
 *           type: string
 *           enum: [unpaid, partial, paid]
 *           description: Статус оплаты
 *         paymentMethod:
 *           type: string
 *           description: Способ оплаты
 *         UserId:
 *           type: integer
 *           description: ID пользователя, создавшего бронирование
 *         RoomId:
 *           type: integer
 *           description: ID забронированного номера
 *       example:
 *         id: 1
 *         checkIn: "2024-07-15T14:00:00.000Z"
 *         checkOut: "2024-07-20T12:00:00.000Z"
 *         adults: 2
 *         children: 1
 *         totalPrice: 27500
 *         specialRequests: "Хотелось бы номер с видом на лес"
 *         status: "confirmed"
 *         paymentStatus: "paid"
 *         paymentMethod: "card"
 *         UserId: 5
 *         RoomId: 3
 */

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Booking = db.define('Booking', {
  checkIn: { 
    type: DataTypes.DATE, 
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  checkOut: { 
    type: DataTypes.DATE, 
    allowNull: false,
    validate: {
      isDate: true,
      isAfterCheckIn(value) {
        if (new Date(value) <= new Date(this.checkIn)) {
          throw new Error('Дата выезда должна быть позже даты заезда');
        }
      }
    }
  },
  adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  children: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: { 
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'confirmed', 'canceled', 'completed']]
    }
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'unpaid',
    validate: {
      isIn: [['unpaid', 'partial', 'paid']]
    }
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Booking; 