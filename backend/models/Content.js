const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['project', 'service', 'page'],
    index: true
  },
  tags: {
    type: [String],
    default: [],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for search
contentSchema.index({
  title: 'text',
  description: 'text',
  content: 'text',
  tags: 'text'
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content; 