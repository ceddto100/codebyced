const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Idea title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  summary: {
    type: String,
    required: [true, 'Idea summary is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  readMoreLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['concept', 'in-progress', 'completed', 'abandoned'],
    default: 'concept'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add a text index for search functionality
ideaSchema.index({ title: 'text', summary: 'text' });

module.exports = mongoose.model('Idea', ideaSchema);