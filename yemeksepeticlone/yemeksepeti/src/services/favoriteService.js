import api from './api';
import { FAVORITES } from '../constants/apiEndpoints';

export const favoriteService = {
  getByUserId: async (userId) => {
    const response = await api.get(FAVORITES);
    return response.data.filter((f) => String(f.userId) === String(userId));
  },
  create: async (userId, restaurantId) => {
    const response = await api.post(FAVORITES, {
      userId: String(userId),
      restaurantId: String(restaurantId)
    });
    return response.data;
  },
  delete: async (favoriteId) => {
    const response = await api.delete(`${FAVORITES}/${favoriteId}`);
    return response.data;
  }
};
