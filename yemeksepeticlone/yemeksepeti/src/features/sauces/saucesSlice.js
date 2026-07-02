import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sauceService } from '../../services/sauceService';

export const fetchSaucesByRestaurant = createAsyncThunk(
  'sauces/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await sauceService.getByRestaurantId(restaurantId);
    } catch (error) {
      return rejectWithValue(error.message || 'Soslar yüklenemedi!');
    }
  }
);

const saucesSlice = createSlice({
  name: 'sauces',
  initialState: {
    restaurantSauces: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRestaurantSauces: (state) => {
      state.restaurantSauces = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaucesByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaucesByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantSauces = action.payload;
      })
      .addCase(fetchSaucesByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRestaurantSauces } = saucesSlice.actions;
export default saucesSlice.reducer;
