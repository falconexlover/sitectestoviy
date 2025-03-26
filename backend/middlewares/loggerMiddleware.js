const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const requestData = {
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length ? req.query : undefined,
    ip: req.ip,
    userId: req.user ? req.user.id : undefined,
    userAgent: req.headers['user-agent'],
  };

  // Добавляем тело запроса только для POST, PUT, PATCH запросов
  // И только если это не файл или слишком большой объект
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method) &&
    req.body &&
    typeof req.body === 'object' &&
    !req.is('multipart/form-data')
  ) {
    // Не логируем пароли и другие чувствительные данные
    const bodyCopy = { ...req.body };
    if (bodyCopy.password) bodyCopy.password = '[СКРЫТО]';
    if (bodyCopy.passwordConfirm) bodyCopy.passwordConfirm = '[СКРЫТО]';
    if (bodyCopy.token) bodyCopy.token = '[СКРЫТО]';
    if (bodyCopy.apiKey) bodyCopy.apiKey = '[СКРЫТО]';

    // Ограничиваем размер логируемого объекта
    if (JSON.stringify(bodyCopy).length < 1000) {
      requestData.body = bodyCopy;
    } else {
      requestData.body = '[ОБЪЕКТ СЛИШКОМ БОЛЬШОЙ]';
    }
  }

  logger.info(`Запрос: ${req.method} ${req.path}`, requestData);

  // Перехватываем ответ для логирования
  const originalSend = res.send;
  res.send = function (body) {
    const responseData = {
      statusCode: res.statusCode,
      responseTime: Date.now() - req._startTime,
      contentLength:
        typeof body === 'string' ? body.length : body ? JSON.stringify(body).length : 0,
    };

    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    logger[logLevel](`Ответ: ${req.method} ${req.path} - ${res.statusCode}`, responseData);

    originalSend.apply(res, arguments);
    return res;
  };

  req._startTime = Date.now();
  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error(`Ошибка: ${req.method} ${req.path} - ${err.message}`, {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code || err.statusCode,
    },
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      userId: req.user ? req.user.id : undefined,
      ip: req.ip,
    },
  });

  next(err);
};

module.exports = {
  requestLogger,
  errorLogger,
};
