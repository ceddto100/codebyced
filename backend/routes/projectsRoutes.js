const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    // Optional query params for filtering
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }

    // Add search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date desc
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST a new project
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// PUT (update) a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
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