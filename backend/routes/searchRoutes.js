const express = require('express');
const router = express.Router();
const { SummarizerManager } = require('node-summarizer');
const Content = require('../models/Content');
const { validateElevenLabsWebhook } = require('../middleware/validation');
const searchService = require('../services/searchService');

// Utility function to generate a summary focused on query-relevant content
const generateQueryFocusedSummary = async (text, query, maxSentences = 3) => {
  try {
    // Initialize summarizer
    const summarizer = new SummarizerManager(text, query);
    
    // Get summary focused on query-relevant content
    const summary = await summarizer.getSummaryByFrequency(maxSentences);
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    // Return a portion of the original text if summarization fails
    return text.slice(0, 250) + '...';
  }
};

// Helper function to perform the search
const performSearch = async (query, options = {}) => {
  // Create text search index if it doesn't exist
  await Content.collection.createIndex({
    title: 'text',
    description: 'text',
    content: 'text',
    tags: 'text'
  });

  // Perform search using MongoDB text search
  const searchResults = await Content.find(
    {
      $text: { $search: query }
    },
    {
      score: { $meta: 'textScore' },
      title: 1,
      description: 1,
      content: 1,
      category: 1,
      tags: 1
    }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(options.limit || 5);

  // If no results found with text search, try fuzzy matching
  if (searchResults.length === 0) {
    const fuzzyResults = await Content.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $elemMatch: { $regex: query, $options: 'i' } } }
      ]
    })
    .limit(options.limit || 5);

    if (fuzzyResults.length > 0) {
      searchResults.push(...fuzzyResults);
    }
  }

  // Generate summaries for each result
  const resultsWithSummaries = await Promise.all(
    searchResults.map(async (result) => {
      const summary = await generateQueryFocusedSummary(
        result.content,
        query,
        options.maxSentences
      );

      return {
        id: result._id,
        title: result.title,
        description: result.description,
        category: result.category,
        tags: result.tags,
        summary,
        content: result.content,
        score: result.score || 0
      };
    })
  );

  return resultsWithSummaries;
};

// GET search endpoint
router.get('/search', async (req, res) => {
  try {
    // Extract and validate query parameter
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    const results = await performSearch(query, {
      limit: 1, // Limit to 1 result for webhook responses
      maxSentences: 3
    });

    // Return simplified response for webhook
    if (results.length > 0) {
      res.json({
        success: true,
        summary: results[0].summary || results[0].content.slice(0, 250) + '...'
      });
    } else {
      res.json({
        success: true,
        summary: "I couldn't find any information about that topic."
      });
    }

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
    const searchOptions = {
      limit: parseInt(options.limit) || 5,
      maxSentences: parseInt(options.maxSentences) || 3,
      categories: Array.isArray(options.categories) ? options.categories : undefined,
      tags: Array.isArray(options.tags) ? options.tags : undefined
    };

    const results = await performSearch(query, searchOptions);

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
    
    const result = await searchService.search(query, {
      limit: 1,
      maxSentences: 3
    });

    if (result.data.length === 0) {
      return res.json({
        success: true,
        summary: "I couldn't find any relevant information about that topic. Could you please rephrase your question?"
      });
    }

    // Return a simplified response format
    res.json({
      success: true,
      summary: result.data[0].summary
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