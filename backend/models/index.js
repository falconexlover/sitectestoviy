const User = require('./User');
const Room = require('./Room');
const Booking = require('./Booking');
const Review = require('./Review');

// Отношения между моделями
Booking.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Booking);

Booking.belongsTo(Room, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Room.hasMany(Booking);

// Связи для отзывов
User.hasMany(Review);
Review.belongsTo(User);

Room.hasMany(Review);
Review.belongsTo(Room);

module.exports = {
  User,
  Room,
  Booking,
  Review,
};
