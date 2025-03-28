import { getApiUrl } from '../utils/api';

// Get all blog posts with optional filtering
export const getBlogPosts = async (page = 1, limit = 10, tag = null, published = null) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (tag) params.append('tag', tag);
    if (published !== null) params.append('published', published);
    
    const response = await fetch(`${getApiUrl('/blog')}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
export const getBlogPost = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/blog')}/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blog post with id ${id}:`, error);
    throw error;
  }
};

// Create a new blog post
export const createBlogPost = async (postData) => {
  try {
    const response = await fetch(getApiUrl('/blog'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Update a blog post
export const updateBlogPost = async (id, postData) => {
  try {
    const response = await fetch(`${getApiUrl('/blog')}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating blog post with id ${id}:`, error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/blog')}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting blog post with id ${id}:`, error);
    throw error;
  }
};