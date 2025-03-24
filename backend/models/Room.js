const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Room = db.define('Room', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    validate: {
      min: 0
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  roomType: {
    type: DataTypes.STRING,
    defaultValue: 'standard'
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
    }
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
    }
  },
  available: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Room; 