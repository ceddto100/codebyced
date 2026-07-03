import { getApiUrl } from '../utils/api';

// Get all testimonials with optional filtering
export const getTestimonials = async (page = 1, limit = 20, featured = null) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (featured !== null) params.append('featured', featured);

    const response = await fetch(`${getApiUrl('/testimonials')}?${params}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};
