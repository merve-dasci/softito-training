import api from './api';
import { ORDERS } from '../constants/apiEndpoints';

export const orderService = {
  getAll: async () => {
    const response = await api.get(ORDERS);
    return response.data;
  },

  getByUserId: async (userId) => {
    const response = await api.get(ORDERS);
    return response.data.filter((o) => String(o.userId) === String(userId));
  },

  create: async (orderData) => {
    const response = await api.post(ORDERS, orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`${ORDERS}/${id}`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`${ORDERS}/${id}`);
    return response.data;
  },
};
