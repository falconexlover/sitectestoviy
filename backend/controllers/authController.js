const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;
    
    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    
    // Создаем нового пользователя (пароль хешируется в хуке beforeCreate)
    const user = await User.create({ 
      username, 
      email, 
      password,
      firstName, 
      lastName, 
      phone 
    });
    
    res.status(201).json({ 
      message: 'Пользователь успешно зарегистрирован', 
      user: { 
        id: user.id, 
        username, 
        email, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Проверяем, существует ли пользователь
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }
    
    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }
    
    // Создаем токен
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получение профиля пользователя
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление профиля пользователя
exports.updateProfile = async (req, res) => {
  try {
    const { username, firstName, lastName, phone } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    await user.update({ username, firstName, lastName, phone });
    
    res.json({ 
      message: 'Профиль успешно обновлен', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        phone: user.phone,
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Изменение пароля
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Проверяем текущий пароль
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Текущий пароль неверен' });
    }
    
    // Обновляем пароль (хеширование в хуке beforeUpdate)
    await user.update({ password: newPassword });
    
    res.json({ message: 'Пароль успешно изменен' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 