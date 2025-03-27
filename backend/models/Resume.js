const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    default: null // null means "Present" or "Current"
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  achievements: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0 // For controlling display order
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);