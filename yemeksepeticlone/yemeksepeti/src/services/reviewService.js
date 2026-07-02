import api from './api';
import { REVIEWS } from '../constants/apiEndpoints';

export const reviewService = {
  getByRestaurantId: async (restaurantId) => {
    const response = await api.get(REVIEWS);
    return response.data.filter((r) => String(r.restaurantId) === String(restaurantId));
  },
  create: async (reviewData) => {
    const response = await api.post(REVIEWS, reviewData);
    return response.data;
  }
};
