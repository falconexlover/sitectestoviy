/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - roomNumber
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор номера
 *         name:
 *           type: string
 *           description: Название номера
 *         description:
 *           type: string
 *           description: Подробное описание номера
 *         price:
 *           type: number
 *           format: float
 *           description: Цена за ночь
 *         capacity:
 *           type: integer
 *           description: Вместимость номера (количество человек)
 *         roomType:
 *           type: string
 *           description: Тип номера (standard, deluxe, suite, и т.д.)
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Список удобств в номере
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Список URL изображений номера
 *         available:
 *           type: boolean
 *           description: Доступен ли номер для бронирования в целом
 *         floor:
 *           type: integer
 *           description: Этаж, на котором расположен номер
 *         roomNumber:
 *           type: string
 *           description: Номер комнаты (уникальный идентификатор в здании)
 *       example:
 *         id: 1
 *         name: Люкс с видом на лес
 *         description: Просторный люкс с панорамным видом на лес и отдельной спальней
 *         price: 5500
 *         capacity: 2
 *         roomType: suite
 *         amenities: ["Wi-Fi", "Телевизор", "Мини-бар", "Кондиционер"]
 *         images: ["room1.jpg", "room1_bathroom.jpg"]
 *         available: true
 *         floor: 2
 *         roomNumber: "201"
 */

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Room = db.define('Room', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  roomType: {
    type: DataTypes.STRING,
    defaultValue: 'standard',
  },
  amenities: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('amenities');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('amenities', JSON.stringify(value || []));
    },
  },
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value || []));
    },
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Room;
