const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const { validateElevenLabsWebhook } = require('../middleware/validation');
const searchService = require('../services/searchService');

// Search validation rules
const searchValidation = [
  query('query')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters long'),
];

// GET search endpoint
router.get('/search', searchValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Extract query parameter
    const { query } = req.query;
    
    const results = await searchService.searchContent(query, 5);

    // Return results
    res.json({
      success: true,
      query,
      resultCount: results.length,
      results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while searching. Please try again.'
    });
  }
});

// POST search endpoint
router.post('/search', async (req, res) => {
  try {
    // Extract and validate query from request body
    const { query, options = {} } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    // Validate and sanitize options
    const limit = parseInt(options.limit) || 5;

    const results = await searchService.searchContent(query, limit);

    // Return results
    res.json({
      success: true,
      query,
      resultCount: results.length,
      results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while searching. Please try again.'
    });
  }
});

// ElevenLabs webhook endpoint
router.post('/elevenlabs-webhook', validateElevenLabsWebhook, async (req, res) => {
  try {
    const { query } = req.body;
    
    const results = await searchService.searchContent(query, 1);

    if (results.length === 0) {
      return res.json({
        success: true,
        summary: "I couldn't find any relevant information about that topic. Could you please rephrase your question?"
      });
    }

    // Return a simplified response format
    res.json({
      success: true,
      summary: results[0].summary
    });
  } catch (error) {
    console.error('Webhook search error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request'
    });
  }
});

module.exports = router; 