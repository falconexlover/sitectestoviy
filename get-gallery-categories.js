const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api/gallery'; // Укажите свой адрес API

(async () => {
  try {
    const res = await fetch(API_URL);
    const images = await res.json();
    const partyImages = images.filter(img => img.category === 'party');
    console.log(`Всего изображений с категорией 'party': ${partyImages.length}\n`);
    partyImages.forEach(img => {
      console.log(`ID: ${img._id}`);
      console.log(`URL: ${img.imageUrl}`);
      console.log(`Title: ${img.title || ''}`);
      console.log(`Description: ${img.description || ''}`);
      console.log('---');
    });
  } catch (err) {
    console.error('Ошибка:', err);
  }
})(); 