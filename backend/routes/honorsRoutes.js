const express = require('express');
const router = express.Router();
const Honor = require('../models/Honor');

// GET all honorable mentions
router.get('/', async (req, res) => {
  try {
    // Optional query params for filtering
    const filter = {};
    if (req.query.year) {
      filter.year = parseInt(req.query.year);
    }
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get honors with pagination
    const honors = await Honor.find(filter)
      .sort({ year: -1, order: 1 }) // Sort by year desc, then order
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Honor.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: honors.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: honors
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET a single honor
router.get('/:id', async (req, res) => {
  try {
    const honor = await Honor.findById(req.params.id);
    
    if (!honor) {
      return res.status(404).json({
        success: false,
        error: 'Honor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: honor
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST a new honor
router.post('/', async (req, res) => {
  try {
    const honor = await Honor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: honor
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// PUT (update) an honor
router.put('/:id', async (req, res) => {
  try {
    const honor = await Honor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!honor) {
      return res.status(404).json({
        success: false,
        error: 'Honor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: honor
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE an honor
router.delete('/:id', async (req, res) => {
  try {
    const honor = await Honor.findByIdAndDelete(req.params.id);
    
    if (!honor) {
      return res.status(404).json({
        success: false,
        error: 'Honor not found'
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