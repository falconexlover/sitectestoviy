const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger');

let db;

/**
 * Инициализация соединения с базой данных
 * Приоритет: DATABASE_URL > DB_* переменные > SQLite для разработки
 */
const initializeDatabase = () => {
  try {
    // Проверяем окружение
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = process.env.VERCEL === '1';

    // Проверяем наличие DATABASE_URL (предпочтительно для Vercel)
    if (process.env.DATABASE_URL) {
      logger.info('Инициализация базы данных через DATABASE_URL');

      db = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: isProduction ? false : console.log,
        pool: {
          max: isVercel ? 1 : 5, // Для Vercel лучше ограничить число соединений
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
    }
    // Стандартное подключение через отдельные параметры
    else if (process.env.DB_HOST && process.env.DB_NAME) {
      logger.info('Инициализация базы данных через параметры DB_*');

      db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: isProduction ? false : console.log,
        pool: {
          max: isVercel ? 1 : 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
    }
    // Fallback на SQLite для разработки
    else {
      logger.info('Инициализация SQLite для разработки');

      db = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.SQLITE_PATH || './database-dev.sqlite',
        logging: isProduction ? false : console.log,
      });
    }

    return db;
  } catch (error) {
    logger.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
};

// Инициализация базы данных при первом импорте модуля
db = initializeDatabase();

// Логируем информацию о диалекте базы данных для отладки
const dialect = db.getDialect();
logger.info(`Используемый диалект базы данных: ${dialect}`);

module.exports = db;
