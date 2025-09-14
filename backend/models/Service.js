// backend/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Service slug is required'],
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'Service summary is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Web Development'
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },

  // Project-style arrays with sane defaults
  packages: {
    type: [{
      tier: { type: String, required: true, trim: true },
      price: { type: String, required: true, trim: true },
      timeline: { type: String, default: '', trim: true },
      items: { type: [String], default: [] },
      badge: { type: String, default: '' },
      gradient: { type: String, default: '' },
      emphasized: { type: Boolean, default: false },
      cta: {
        label: { type: String, default: '' },
        to: { type: String, default: '' }
      }
    }],
    default: []
  },

  modernization: {
    type: [{
      name: { type: String, trim: true },
      price: { type: String, trim: true }
    }],
    default: []
  },

  maintenance: {
    type: [{
      name: { type: String, required: true, trim: true },
      price: { type: String, required: true, trim: true },
      response: { type: String, default: '', trim: true },
      features: { type: [String], default: [] },
      badge: { type: String, default: '' },
      gradient: { type: String, default: '' },
      emphasized: { type: Boolean, default: false },
      cta: { type: String, default: '' }
    }],
    default: []
  },

  alacarte: {
    type: [{
      name: { type: String, trim: true },
      price: { type: String, trim: true }
    }],
    default: []
  },

  process: {
    type: [{
      name: { type: String, trim: true },
      desc: { type: String, trim: true }
    }],
    default: []
  },

  slas: {
    type: [String],
    default: []
  },

  faq: {
    type: [{
      q: { type: String, trim: true },
      a: { type: String, trim: true }
    }],
    default: []
  },

  seo: {
    title: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    url: { type: String, default: '', trim: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
