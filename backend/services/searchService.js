const Content = require('../models/Content');
const { SummarizerManager } = require('node-summarizer');

/**
 * Generate a query-focused summary of content
 * @param {string} text - The text to summarize
 * @param {string} query - The search query to focus the summary on
 * @param {number} maxSentences - Maximum number of sentences in the summary
 * @returns {string} - Summarized text
 */
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

/**
 * Search content based on query
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Array} - Search results with summaries
 */
const searchContent = async (query, limit = 5) => {
  try {
    // Create text search index if it doesn't exist
    try {
      await Content.collection.createIndex({
        title: 'text',
        description: 'text',
        content: 'text',
        tags: 'text'
      });
    } catch (indexError) {
      // If index already exists or can't be created, continue with the search
      console.log('Index operation:', indexError.message);
    }

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
    .limit(limit);

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
      .limit(limit);

      if (fuzzyResults.length > 0) {
        searchResults.push(...fuzzyResults);
      }
    }

    // Generate summaries for each result
    const resultsWithSummaries = await Promise.all(
      searchResults.map(async (result) => {
        const summary = await generateQueryFocusedSummary(
          result.content,
          query
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
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

module.exports = {
  searchContent,
  generateQueryFocusedSummary
}; 