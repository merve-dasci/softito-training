import api from './api';
import { USERS } from '../constants/apiEndpoints';

export const authService = {
  login: async (email, password) => {
    const response = await api.get(`${USERS}?email=${encodeURIComponent(email)}`);
    if (response.data && response.data.length > 0) {
      const user = response.data[0];
      if (String(user.password) === String(password)) {
        return user;
      }
    }
    throw new Error('E-posta adresi veya şifre hatalı!');
  },

  register: async (name, email, password, role = 'customer') => {
    // Check if user already exists
    const checkResponse = await api.get(`${USERS}?email=${encodeURIComponent(email)}`);
    if (checkResponse.data && checkResponse.data.length > 0) {
      throw new Error('Bu e-posta adresi zaten kullanımda!');
    }

    const response = await api.post(USERS, {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },
};
