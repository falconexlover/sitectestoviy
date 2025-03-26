/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор отзыва
 *         rating:
 *           type: integer
 *           description: Оценка от 1 до 5
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           description: Текст отзыва
 *         userId:
 *           type: integer
 *           description: ID пользователя, оставившего отзыв
 *         roomId:
 *           type: integer
 *           description: ID номера, к которому относится отзыв
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата и время создания отзыва
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата и время последнего обновления отзыва
 *       example:
 *         id: 1
 *         rating: 5
 *         comment: "Прекрасный номер с видом на лес. Очень чисто и уютно. Рекомендую!"
 *         userId: 3
 *         roomId: 2
 *         createdAt: "2024-03-15T14:23:45.678Z"
 *         updatedAt: "2024-03-15T14:23:45.678Z"
 */

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Review = db.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [2, 1000],
    },
  },
  // Дополнительные поля для отзыва
  stayDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pros: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cons: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Категории оценок
  cleanlinessRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  serviceRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comfortRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  locationRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  valueRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = Review;
