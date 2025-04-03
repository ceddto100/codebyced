import { getApiUrl } from '../utils/api';

export const getMentions = async (page = 1, limit = 100) => {
  try {
    const url = getApiUrl('/honors');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mentions:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch mentions'
    };
  }
};

export const getMention = async (id) => {
  try {
    const url = getApiUrl(`/honors/${id}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mention:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch mention'
    };
  }
};

export const createMention = async (mentionData) => {
  try {
    const url = getApiUrl('/honors');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mentionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating mention:', error);
    return {
      success: false,
      error: error.message || 'Failed to create mention'
    };
  }
};

export const updateMention = async (id, mentionData) => {
  try {
    const url = getApiUrl(`/honors/${id}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mentionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating mention:', error);
    return {
      success: false,
      error: error.message || 'Failed to update mention'
    };
  }
};

export const deleteMention = async (id) => {
  try {
    const url = getApiUrl(`/honors/${id}`);
    const response = await fetch(url, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting mention:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete mention'
    };
  }
}; 