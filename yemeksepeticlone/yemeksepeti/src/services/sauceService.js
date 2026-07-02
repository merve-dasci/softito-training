import api from './api';

export const sauceService = {
  getAll: async () => {
    const response = await api.get('/sauces');
    return response.data;
  },
  getByRestaurantId: async (restaurantId) => {
    const response = await api.get(`/sauces?restaurantId=${restaurantId}`);
    return response.data;
  }
};
