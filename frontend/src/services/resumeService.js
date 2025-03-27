import api from './api';

// Get all resume entries
export const getResumeEntries = async () => {
  try {
    const response = await api.get('/resume');
    return response.data;
  } catch (error) {
    console.error('Error fetching resume entries:', error);
    throw error;
  }
};

// Get a single resume entry by ID
export const getResumeEntry = async (id) => {
  try {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resume entry with id ${id}:`, error);
    throw error;
  }
};

// Create a new resume entry (for admin purposes)
export const createResumeEntry = async (resumeData) => {
  try {
    const response = await api.post('/resume', resumeData);
    return response.data;
  } catch (error) {
    console.error('Error creating resume entry:', error);
    throw error;
  }
};

// Update a resume entry (for admin purposes)
export const updateResumeEntry = async (id, resumeData) => {
  try {
    const response = await api.put(`/resume/${id}`, resumeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating resume entry with id ${id}:`, error);
    throw error;
  }
};

// Delete a resume entry (for admin purposes)
export const deleteResumeEntry = async (id) => {
  try {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting resume entry with id ${id}:`, error);
    throw error;
  }
};