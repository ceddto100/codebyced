import { getApiUrl } from '../utils/api';

// Get all resume entries
export const getResumeEntries = async () => {
  try {
    const response = await fetch(getApiUrl('/resume'));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching resume entries:', error);
    throw error;
  }
};

// Get a single resume entry by ID
export const getResumeEntry = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/resume')}/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching resume entry with id ${id}:`, error);
    throw error;
  }
};

// Create a new resume entry
export const createResumeEntry = async (entryData) => {
  try {
    const response = await fetch(getApiUrl('/resume'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating resume entry:', error);
    throw error;
  }
};

// Update a resume entry
export const updateResumeEntry = async (id, entryData) => {
  try {
    const response = await fetch(`${getApiUrl('/resume')}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating resume entry with id ${id}:`, error);
    throw error;
  }
};

// Delete a resume entry
export const deleteResumeEntry = async (id) => {
  try {
    const response = await fetch(`${getApiUrl('/resume')}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting resume entry with id ${id}:`, error);
    throw error;
  }
};