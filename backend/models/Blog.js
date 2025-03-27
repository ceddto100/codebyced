const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  tags: {
    type: [String],
    default: []
  },
  coverImage: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add a text index for search functionality
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

module.exports = mongoose.model('Blog', blogSchema);