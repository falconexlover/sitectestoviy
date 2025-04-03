const mongoose = require('mongoose');

// Схема для секции главной страницы
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  buttonText: {
    type: String,
    trim: true
  },
  buttonLink: {
    type: String,
    trim: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Схема для главной страницы
const homepageSchema = new mongoose.Schema({
  hero: sectionSchema,
  about: sectionSchema,
  features: [sectionSchema],
  gallery: {
    title: {
      type: String,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    buttonText: {
      type: String,
      trim: true
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  rooms: {
    title: {
      type: String,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    buttonText: {
      type: String,
      trim: true
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  testimonials: {
    title: {
      type: String,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    items: [{
      name: {
        type: String,
        trim: true
      },
      text: {
        type: String,
        trim: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      }
    }],
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  contact: sectionSchema,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Homepage', homepageSchema); 