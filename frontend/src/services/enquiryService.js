import api from './api';

export const createEnquiry = async (payload) => {
  const { data } = await api.post('/api/enquiries', payload);
  return data;
};

export const fetchEnquiries = async (params = {}) => {
  const { data } = await api.get('/api/enquiries', { params });
  return data;
};

export const updateEnquiry = async (id, payload) => {
  const { data } = await api.put(`/api/enquiries/${id}`, payload);
  return data;
};

export const deleteEnquiry = async (id) => {
  const { data } = await api.delete(`/api/enquiries/${id}`);
  return data;
};