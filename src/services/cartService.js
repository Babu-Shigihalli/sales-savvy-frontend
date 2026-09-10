import api from './api';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.put(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  await api.delete(`/cart/${cartItemId}`);
};