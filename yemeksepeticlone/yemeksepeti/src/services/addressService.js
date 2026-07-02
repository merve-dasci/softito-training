import api from './api';
import { ADDRESSES } from '../constants/apiEndpoints';

export const addressService = {
  getByUserId: async (userId) => {
    const response = await api.get(ADDRESSES);
    return response.data.filter((a) => String(a.userId) === String(userId));
  },
  create: async (addressData) => {
    const response = await api.post(ADDRESSES, addressData);
    return response.data;
  },
  delete: async (addressId) => {
    const response = await api.delete(`${ADDRESSES}/${addressId}`);
    return response.data;
  }
};
