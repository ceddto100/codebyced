import api from './api';

// Get all honors with optional filtering
export const getHonors = async (page = 1, limit = 20, year = null, featured = null) => {
  try {
    const params = { page, limit };
    if (year) params.year = year;
    if (featured !== null) params.featured = featured;
    
    const response = await api.get('/honors', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching honors:', error);
    throw error;
  }
};

// Get a single honor by ID
export const getHonor = async (id) => {
  try {
    const response = await api.get(`/honors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching honor with id ${id}:`, error);
    throw error;
  }
};

// Create a new honor (for admin purposes)
export const createHonor = async (honorData) => {
  try {
    const response = await api.post('/honors', honorData);
    return response.data;
  } catch (error) {
    console.error('Error creating honor:', error);
    throw error;
  }
};

// Update an honor (for admin purposes)
export const updateHonor = async (id, honorData) => {
  try {
    const response = await api.put(`/honors/${id}`, honorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating honor with id ${id}:`, error);
    throw error;
  }
};

// Delete an honor (for admin purposes)
export const deleteHonor = async (id) => {
  try {
    const response = await api.delete(`/honors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting honor with id ${id}:`, error);
    throw error;
  }
};