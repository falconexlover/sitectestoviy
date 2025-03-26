const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Оптимизирует изображение с заданными параметрами
 * @param {string} sourcePath - Путь к исходному изображению
 * @param {string} targetPath - Путь для сохранения оптимизированного изображения
 * @param {Object} options - Параметры оптимизации
 * @returns {Promise<Object>} - Информация о результате оптимизации
 */
const optimizeImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return true;
  } catch (error) {
    logger.error('Ошибка при оптимизации изображения:', error);
    return false;
  }
};

/**
 * Генерирует несколько версий изображения для разных разрешений экрана
 * @param {string} sourcePath - Путь к исходному изображению
 * @param {string} targetDir - Директория для сохранения оптимизированных версий
 * @param {string} baseName - Базовое имя файла для оптимизированных версий
 * @param {Object} options - Параметры оптимизации
 * @returns {Promise<Object>} - Информация о созданных версиях
 */
const generateResponsiveImages = async (sourcePath, targetDir, baseName, options = {}) => {
  try {
    const { sizes = [400, 800, 1200, 1600], formats = ['webp', 'jpg'], quality = 80 } = options;

    const results = {};
    const baseImageName = baseName || path.basename(sourcePath, path.extname(sourcePath));

    // Создаем версии для каждого формата и размера
    for (const format of formats) {
      results[format] = [];

      for (const width of sizes) {
        const targetPath = path.join(targetDir, `${baseImageName}-${width}.${format}`);

        const result = await optimizeImage(sourcePath, targetPath, {
          width,
          format,
          quality,
        });

        results[format].push(result);
      }
    }

    return {
      original: sourcePath,
      versions: results,
    };
  } catch (error) {
    logger.error(`Ошибка при создании адаптивных изображений: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Оптимизирует все изображения в указанной директории
 * @param {string} sourceDir - Директория с исходными изображениями
 * @param {string} targetDir - Директория для сохранения оптимизированных изображений
 * @param {Object} options - Параметры оптимизации
 * @returns {Promise<Array>} - Массив результатов оптимизации
 */
const optimizeDirectory = async (sourceDir, targetDir, options = {}) => {
  try {
    const {
      recursive = true,
      extensions = ['.jpg', '.jpeg', '.png'],
      skipExisting = true,
    } = options;

    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Директория не существует: ${sourceDir}`);
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = getFiles(sourceDir, { recursive, extensions });
    const results = [];

    for (const file of files) {
      const relativePath = path.relative(sourceDir, file);
      const targetPath = path.join(targetDir, relativePath);
      const targetExtension = options.format ? `.${options.format}` : path.extname(file);
      const targetPathWithExt = targetPath.replace(/\.[^/.]+$/, targetExtension);

      // Пропускаем уже существующие файлы, если нужно
      if (skipExisting && fs.existsSync(targetPathWithExt)) {
        logger.info(`Пропущен существующий файл: ${targetPathWithExt}`);
        continue;
      }

      try {
        const result = await optimizeImage(file, targetPathWithExt, options);
        results.push(result);
      } catch (error) {
        logger.error(`Ошибка при оптимизации ${file}: ${error.message}`);
      }
    }

    return results;
  } catch (error) {
    logger.error(`Ошибка при оптимизации директории: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Получает все файлы из директории с указанными опциями
 * @param {string} dir - Директория для сканирования
 * @param {Object} options - Опции сканирования
 * @returns {Array<string>} - Массив путей к файлам
 */
const getFiles = (dir, options = {}) => {
  const { recursive = true, extensions = null } = options;
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory() && recursive) {
      // Рекурсивно сканируем вложенные директории
      results = results.concat(getFiles(filePath, options));
    } else {
      // Проверяем расширение файла, если указаны ограничения
      if (!extensions || extensions.includes(path.extname(file).toLowerCase())) {
        results.push(filePath);
      }
    }
  });

  return results;
};

module.exports = {
  optimizeImage,
  generateResponsiveImages,
  optimizeDirectory,
};
