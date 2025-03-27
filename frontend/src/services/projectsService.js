import api from './api';

// Get all projects with optional filtering
export const getProjects = async (page = 1, limit = 20, category = null, featured = null) => {
  try {
    const params = { page, limit };
    if (category) params.category = category;
    if (featured !== null) params.featured = featured;
    
    const response = await api.get('/projects', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get a single project by ID
export const getProject = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
};

// Create a new project (for admin purposes)
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update a project (for admin purposes)
export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
};

// Delete a project (for admin purposes)
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
};