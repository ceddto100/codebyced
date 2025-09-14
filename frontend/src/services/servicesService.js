// frontend/src/services/servicesService.js
import { getApiUrl } from '../utils/api';

// Get all services with optional filtering
export const getServices = async (page = 1, limit = 20, category = null, featured = null, active = null, search = null) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    if (featured !== null) params.append('featured', featured);
    if (active !== null) params.append('active', active);
    if (search) params.append('search', search);

    const response = await fetch(`${getApiUrl('/services')}?${params}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get a single service by ID or slug
export const getService = async (idOrSlug) => {
  try {
    const response = await fetch(`${getApiUrl('/services')}/${idOrSlug}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching service with id/slug ${idOrSlug}:`, error);
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await fetch(getApiUrl('/services'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update a service
export const updateService = async (idOrSlug, serviceData) => {
  try {
    const response = await fetch(`${getApiUrl('/services')}/${idOrSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating service with id/slug ${idOrSlug}:`, error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (idOrSlug) => {
  try {
    const response = await fetch(`${getApiUrl('/services')}/${idOrSlug}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting service with id/slug ${idOrSlug}:`, error);
    throw error;
  }
};
