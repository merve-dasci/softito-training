import api from './api';
import { PRODUCTS } from '../constants/apiEndpoints';

export const productService = {
  getAll: async () => {
    const response = await api.get(PRODUCTS);
    return response.data;
  },

  getByRestaurantId: async (restaurantId) => {
    const response = await api.get(`${PRODUCTS}?restaurantId=${restaurantId}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post(PRODUCTS, productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`${PRODUCTS}/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${PRODUCTS}/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`${PRODUCTS}?name_like=${encodeURIComponent(query)}`);
    return response.data;
  },
};
