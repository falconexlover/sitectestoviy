const winston = require('winston');
const path = require('path');

// Определение форматов логирования
const formats = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Настройка транспортов
const transports = [
  // Запись критических ошибок в отдельный файл
  new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/error.log'), 
    level: 'error' 
  }),
  // Запись всех логов уровня info и выше
  new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/combined.log') 
  })
];

// В режиме разработки выводим логи в консоль
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// Создание экземпляра логгера
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: formats,
  transports
});

// Создание обработчика для HTTP-запросов
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger; 