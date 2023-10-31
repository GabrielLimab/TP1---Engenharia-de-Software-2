import api from './api';
import { AxiosError } from 'axios';

export const uploadPicture = async (file: File, tag: string) => {
  const formData = new FormData();
  formData.append('picture', file);
  formData.append('tag', tag);

  const response = await api.post('/pictures/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).catch(
    (error: AxiosError) => {
      if (error.response) {
        throw error.response.data;
      }
  });
  
  return response;
}

export const getSelectedPictures = async (selected: string, tag: string) => {
  try {
    let response;
    if (selected === 'Following') {
      response = await api.get('/pictures/following');
    } else if (selected === 'Filter') {
      response = await api.post('/pictures/tag/', { tag });
    } else if (selected === 'For You' || response === undefined) {
      response = await api.get('/pictures/top');
    }
    
    return response;
  }
  catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
  
}

export const getPicturesByUserID = async (id: string) => {
  try {
    const response = await api.get('/pictures/user/' + id);
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export const toggleLike = async (pictureId: string) => {
  try {
    api.put('/pictures/likes/' + pictureId);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
