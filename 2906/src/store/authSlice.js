import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URL
const API_URL = 'http://localhost:3001';

// Load initial user from localStorage if it exists
const initialUser = JSON.parse(localStorage.getItem('currentUser')) || null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Sunucu hatası.');
      }
      const users = await response.json();
      const user = users.find(u => u.password === password);
      if (!user) {
        return rejectWithValue('E-posta veya şifre hatalı.');
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Giriş yapılamadı.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if user already exists
      const checkRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(userData.email)}`);
      if (checkRes.ok) {
        const existingUsers = await checkRes.json();
        if (existingUsers.length > 0) {
          return rejectWithValue('Bu e-posta adresi zaten kullanımda.');
        }
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Kayıt oluşturulamadı.');
      }

      const newUser = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Kayıt sırasında bir hata oluştu.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('currentUser');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
