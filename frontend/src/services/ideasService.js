import api from './api';

// Get all ideas with optional filtering
export const getIdeas = async (page = 1, limit = 20, tag = null, status = null) => {
  try {
    const params = { page, limit };
    if (tag) params.tag = tag;
    if (status) params.status = status;
    
    const response = await fetch('http://localhost:5000/api/ideas');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ideas:', error);
    throw error;
  }
};

// Get a single idea by ID
export const getIdea = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/ideas/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching idea with id ${id}:`, error);
    throw error;
  }
};

// Create a new idea
export const createIdea = async (ideaData) => {
  try {
    const response = await fetch('http://localhost:5000/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ideaData),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
};

// Update an idea
export const updateIdea = async (id, ideaData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/ideas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ideaData),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating idea with id ${id}:`, error);
    throw error;
  }
};

// Delete an idea
export const deleteIdea = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/ideas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting idea with id ${id}:`, error);
    throw error;
  }
};