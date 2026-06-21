import api from './api';

export const sendContactMessage = async (payload) => {
  const { data } = await api.post('/api/contact', payload);
  return data;
};

export const fetchContacts = async (params = {}) => {
  const { data } = await api.get('/api/contact', { params });
  return data;
};