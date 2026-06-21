import api from './api';

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/api/admin/dashboard');
  return data;
};

export const fetchAnalytics = async () => {
  const { data } = await api.get('/api/admin/analytics');
  return data;
};

export const fetchUsers = async (params = {}) => {
  const { data } = await api.get('/api/admin/users', { params });
  return data;
};

export const createAdminUser = async (payload) => {
  const { data } = await api.post('/api/admin/users', payload);
  return data;
};

export const deleteAdminUser = async (id) => {
  const { data } = await api.delete(`/api/admin/users/${id}`);
  return data;
};

export const updateProductAvailability = async (id, payload) => {
  const { data } = await api.patch(`/api/admin/products/${id}/availability`, payload);
  return data;
};
