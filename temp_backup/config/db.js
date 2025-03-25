const { Sequelize } = require('sequelize');
require('dotenv').config();

let db;

// Выбор диалекта базы данных в зависимости от режима запуска
if (process.env.NODE_ENV === 'production') {
  // PostgreSQL для продакшена через DATABASE_URL (для Vercel)
  if (process.env.DATABASE_URL) {
    db = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  } else {
    // Стандартное подключение к PostgreSQL
    db = new Sequelize(
      process.env.DB_NAME, 
      process.env.DB_USER, 
      process.env.DB_PASSWORD, 
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
  }
} else {
  // SQLite для разработки и тестирования
  db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = db; 