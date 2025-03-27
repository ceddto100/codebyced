const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  techStack: {
    type: [String],
    default: []
  },
  githubLink: {
    type: String,
    default: ''
  },
  demoLink: {
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
  completed: {
    type: Boolean,
    default: true
  },
  completionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);