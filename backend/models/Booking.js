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