import api from './api';

export const drinkService = {
  getAll: async () => {
    const response = await api.get('/drinks');
    return response.data;
  },
  getByRestaurantId: async (restaurantId) => {
    const response = await api.get(`/drinks?restaurantId=${restaurantId}`);
    return response.data;
  }
};
