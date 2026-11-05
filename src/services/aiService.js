import api from './api';

export const generateDescription = async (name, category) => {
  const response = await api.post('/ai/description', { name, category });
  return response.data.description;
};
