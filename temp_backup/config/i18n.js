const i18next = require('i18next');
const path = require('path');
const fs = require('fs');

/**
 * Загрузка всех переводов из директории locales
 * @param {string} dir - Путь к директории с переводами
 * @returns {Object} - Объект с ресурсами переводов
 */
const loadTranslations = (dir) => {
  const resources = {};
  
  // Получение списка поддерживаемых языков
  const langDirs = fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Загрузка переводов для каждого языка
  langDirs.forEach(lang => {
    resources[lang] = {};
    
    // Чтение JSON-файлов в директории языка
    const langPath = path.join(dir, lang);
    const files = fs.readdirSync(langPath)
      .filter(file => file.endsWith('.json'));
    
    // Загрузка содержимого каждого файла
    files.forEach(file => {
      const namespace = file.replace('.json', '');
      const filePath = path.join(langPath, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        resources[lang][namespace] = JSON.parse(content);
      } catch (err) {
        console.error(`Ошибка при загрузке файла локализации ${filePath}`, err);
      }
    });
  });
  
  return resources;
};

// Инициализация i18next
i18next.init({
  resources: loadTranslations(path.join(__dirname, '..', 'locales')),
  lng: 'ru', // Язык по умолчанию
  fallbackLng: 'ru',
  preload: ['ru', 'en'],
  defaultNS: 'common',
  ns: ['common', 'errors', 'emails'],
  keySeparator: '.', // Разделитель для вложенных ключей
  interpolation: {
    escapeValue: false // Не экранировать значения для HTML
  }
});

module.exports = i18next; 