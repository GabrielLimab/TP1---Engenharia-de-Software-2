import api from './api';
import { AxiosError } from 'axios';

export const login = async (email: string, password: string) => {
  const response = await api.post('/users/login/', { email, password }).catch(
    (error: AxiosError) => {
      if (error.response) {
        throw error.response.data;
      }
  });

  return response;
} 

export const signup = async (name: string, username: string, email: string, password: string, file: File) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('picture', file);

  const response = await api.post('/users/', formData, {
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

export const logout = async () => {
  const response = await api.post('/users/logout/').catch(
    (error: AxiosError) => {
      if (error.response) {
        throw error.response.data;
      }
  });

  return response;
}