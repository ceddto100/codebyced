const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

// GET all resume entries
router.get('/', async (req, res) => {
  try {
    const resumeEntries = await Resume.find()
      .sort({ order: 1, startDate: -1 }); // Sort by order first, then by start date
    
    res.status(200).json({
      success: true,
      count: resumeEntries.length,
      data: resumeEntries
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET a single resume entry
router.get('/:id', async (req, res) => {
  try {
    const resumeEntry = await Resume.findById(req.params.id);
    
    if (!resumeEntry) {
      return res.status(404).json({
        success: false,
        error: 'Resume entry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resumeEntry
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST a new resume entry
router.post('/', async (req, res) => {
  try {
    const resumeEntry = await Resume.create(req.body);
    
    res.status(201).json({
      success: true,
      data: resumeEntry
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// PUT (update) a resume entry
router.put('/:id', async (req, res) => {
  try {
    const resumeEntry = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resumeEntry) {
      return res.status(404).json({
        success: false,
        error: 'Resume entry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resumeEntry
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE a resume entry
router.delete('/:id', async (req, res) => {
  try {
    const resumeEntry = await Resume.findByIdAndDelete(req.params.id);
    
    if (!resumeEntry) {
      return res.status(404).json({
        success: false,
        error: 'Resume entry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;