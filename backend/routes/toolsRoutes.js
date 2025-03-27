const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');

// GET all tools
router.get('/', async (req, res) => {
  try {
    // Optional query params for filtering
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.recommended) {
      filter.recommended = req.query.recommended === 'true';
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get tools with pagination
    const tools = await Tool.find(filter)
      .sort({ order: 1, name: 1 }) // Sort by order, then name
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Tool.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tools.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: tools
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET a single tool
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: 'Tool not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: tool
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST a new tool
router.post('/', async (req, res) => {
  try {
    const tool = await Tool.create(req.body);
    
    res.status(201).json({
      success: true,
      data: tool
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// PUT (update) a tool
router.put('/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: 'Tool not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: tool
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE a tool
router.delete('/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: 'Tool not found'
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