const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tool name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Tool description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Tool category is required'],
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: [true, 'External link is required']
  },
  features: {
    type: [String],
    default: []
  },
  recommended: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0 // For controlling display order
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tool', toolSchema);