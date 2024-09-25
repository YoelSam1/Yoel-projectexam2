import { API_BASE_URL } from '../BaseURL/api';

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw error; 
  }
};

// Function to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data)); // Save user data to localStorage
    return data;
  } catch (error) {
    throw error; 
  }
};
