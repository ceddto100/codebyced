const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// GET all ideas
router.get('/', async (req, res) => {
  try {
    // Optional query params for filtering
    const filter = {};
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const ideas = await Idea.find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date desc
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Idea.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: ideas.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: ideas
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET a single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST a new idea
router.post('/', async (req, res) => {
  try {
    const idea = await Idea.create(req.body);
    
    res.status(201).json({
      success: true,
      data: idea
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// PUT (update) an idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE an idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
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