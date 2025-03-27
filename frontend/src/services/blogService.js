import api from './api';

// Get all blog posts with optional filtering
export const getBlogPosts = async (page = 1, limit = 10, tag = null, published = null) => {
  try {
    const params = { page, limit };
    if (tag) params.tag = tag;
    if (published !== null) params.published = published;
    
    const response = await api.get('/blog', { params });
    
    // Validate response structure
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response format from API');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
export const getBlogPost = async (id) => {
  try {
    const response = await api.get(`/blog/${id}`);
    
    // Validate response structure
    if (!response.data || !response.data.data || typeof response.data.data !== 'object') {
      throw new Error('Invalid response format from API');
    }
    
    // Ensure the response has the required fields
    const post = response.data.data;
    if (!post.title || !post.content) {
      throw new Error('Invalid blog post data: missing required fields');
    }
    
    return {
      success: true,
      data: {
        _id: post._id || id,
        title: String(post.title),
        content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
        excerpt: String(post.excerpt || ''),
        date: post.date || new Date().toISOString(),
        tags: Array.isArray(post.tags) ? post.tags.map(tag => String(tag)) : [],
        coverImage: String(post.coverImage || '')
      }
    };
  } catch (error) {
    console.error(`Error fetching blog post with id ${id}:`, error);
    throw error;
  }
};

// Create a new blog post (for admin purposes)
export const createBlogPost = async (postData) => {
  try {
    // Validate post data before sending
    if (!postData.title || !postData.content) {
      throw new Error('Title and content are required');
    }
    
    const response = await api.post('/blog', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Update a blog post (for admin purposes)
export const updateBlogPost = async (id, postData) => {
  try {
    // Validate post data before sending
    if (!postData.title || !postData.content) {
      throw new Error('Title and content are required');
    }
    
    const response = await api.put(`/blog/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog post with id ${id}:`, error);
    throw error;
  }
};

// Delete a blog post (for admin purposes)
export const deleteBlogPost = async (id) => {
  try {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog post with id ${id}:`, error);
    throw error;
  }
};