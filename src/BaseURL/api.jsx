import axios from 'axios';

export const API_BASE_URL = "https://api.noroff.dev/api/v1";

// Function to fetch venue details with retry logic
export const fetchVenueDetails = async (id, retries = 3) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/holidaze/venues/${id}?_bookings=true`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      // Retry after a delay
      await new Promise(res => setTimeout(res, 1000)); 
      return fetchVenueDetails(id, retries - 1);
    }
    console.error('Error fetching venue details:', error);
    throw error;
  }
};
