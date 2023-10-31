import api from './api';

export const getTagByName = async (tag: string) => {
  try {
    const response = await api.get('/tags/' + tag);
    return response;
  } catch (error) {
    console.error('Error fetching tag data:', error);
    throw error;
  }
}