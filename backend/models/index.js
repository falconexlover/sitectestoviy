const User = require('./User');
const Room = require('./Room');
const Booking = require('./Booking');

// Отношения между моделями
Booking.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Booking);

Booking.belongsTo(Room, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Room.hasMany(Booking);

module.exports = {
  User,
  Room,
  Booking
}; 