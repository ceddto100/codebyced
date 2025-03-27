const mongoose = require('mongoose');

const honorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Honor title is required'],
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  year: {
    type: Number
  },
  image: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0 // For controlling display order
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Honor', honorSchema);