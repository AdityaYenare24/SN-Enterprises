import api from './api';

export const registerUser = async (payload) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/api/auth/profile');
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await api.post('/api/auth/forgot-password', payload);
  return data;
};

export const resetPassword = async (payload, token) => {
  const endpoint = token ? `/api/auth/reset-password/${token}` : '/api/auth/reset-password';
  const { data } = await api.post(endpoint, payload);
  return data;
};