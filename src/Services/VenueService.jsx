import axios from 'axios';
import { API_BASE_URL } from '../BaseURL/api';

// Function to get venues for a specific user
export const getUserVenues = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/holidaze/venues/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user venues:', error);
    throw error;
  }
};
