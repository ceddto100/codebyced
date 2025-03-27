const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET all blog posts
router.get('/', async (req, res) => {
  try {
    // Optional query params for filtering
    const filter = {};
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    if (req.query.published) {
      filter.published = req.query.published === 'true';
    }

    // Add search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .sort({ date: -1 }) // Sort by date desc
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: blogs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET a single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST a new blog post
router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// PUT (update) a blog post
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE a blog post
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
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