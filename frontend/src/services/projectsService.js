import { getApiUrl } from '../utils/api';

// Get all projects with optional filtering
export const getProjects = async (page = 1, limit = 20, category = null, featured = null) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    if (featured !== null) params.append('featured', featured);
    
    const response = await fetch(`${getApiUrl('/projects')}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get a single project by ID
export const getProject = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/projects')}/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await fetch(getApiUrl('/projects'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update a project
export const updateProject = async (id, projectData) => {
  try {
    const response = await fetch(`${getApiUrl('/projects')}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/projects')}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
};