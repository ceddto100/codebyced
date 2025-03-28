import { getApiUrl } from '../utils/api';

// Get all tools with optional filtering
export const getTools = async (page = 1, limit = 20, category = null, recommended = null) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    if (recommended !== null) params.append('recommended', recommended);
    
    const response = await fetch(`${getApiUrl('/tools')}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

// Get a single tool by ID
export const getTool = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/tools')}/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching tool with id ${id}:`, error);
    throw error;
  }
};

// Create a new tool
export const createTool = async (toolData) => {
  try {
    const response = await fetch(getApiUrl('/tools'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating tool:', error);
    throw error;
  }
};

// Update a tool
export const updateTool = async (id, toolData) => {
  try {
    const response = await fetch(`${getApiUrl('/tools')}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating tool with id ${id}:`, error);
    throw error;
  }
};

// Delete a tool
export const deleteTool = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/tools')}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting tool with id ${id}:`, error);
    throw error;
  }
};