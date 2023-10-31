import api from './api';

export const getLoggedUser = async () => {
  try {
    const response = await api.get('/users/me/');
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const response = await api.get('/users/username/' + username);
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export const toggleFollow = async (id: string) => {
  try {
    await api.put('/users/follow/' + id);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}