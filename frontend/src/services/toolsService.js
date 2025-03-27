import api from './api';

// Get all tools with optional filtering
export const getTools = async (page = 1, limit = 20, category = null, recommended = null) => {
  try {
    const params = { page, limit };
    if (category) params.category = category;
    if (recommended !== null) params.recommended = recommended;
    
    const response = await api.get('/tools', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

// Get a single tool by ID
export const getTool = async (id) => {
  try {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tool with id ${id}:`, error);
    throw error;
  }
};

// Create a new tool (for admin purposes)
export const createTool = async (toolData) => {
  try {
    const response = await api.post('/tools', toolData);
    return response.data;
  } catch (error) {
    console.error('Error creating tool:', error);
    throw error;
  }
};

// Update a tool (for admin purposes)
export const updateTool = async (id, toolData) => {
  try {
    const response = await api.put(`/tools/${id}`, toolData);
    return response.data;
  } catch (error) {
    console.error(`Error updating tool with id ${id}:`, error);
    throw error;
  }
};

// Delete a tool (for admin purposes)
export const deleteTool = async (id) => {
  try {
    const response = await api.delete(`/tools/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting tool with id ${id}:`, error);
    throw error;
  }
};