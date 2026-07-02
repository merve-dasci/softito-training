import api from './api';
import { RESTAURANTS } from '../constants/apiEndpoints';

export const restaurantService = {
  getAll: async () => {
    const response = await api.get(RESTAURANTS);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${RESTAURANTS}/${id}`);
    return response.data;
  },

  create: async (restaurantData) => {
    const response = await api.post(RESTAURANTS, restaurantData);
    return response.data;
  },

  update: async (id, restaurantData) => {
    const response = await api.put(`${RESTAURANTS}/${id}`, restaurantData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${RESTAURANTS}/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`${RESTAURANTS}?name_like=${encodeURIComponent(query)}`);
    return response.data;
  },
};
