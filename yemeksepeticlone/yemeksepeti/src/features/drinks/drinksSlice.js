import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { drinkService } from '../../services/drinkService';

export const fetchDrinksByRestaurant = createAsyncThunk(
  'drinks/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await drinkService.getByRestaurantId(restaurantId);
    } catch (error) {
      return rejectWithValue(error.message || 'İçecekler yüklenemedi!');
    }
  }
);

const drinksSlice = createSlice({
  name: 'drinks',
  initialState: {
    restaurantDrinks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRestaurantDrinks: (state) => {
      state.restaurantDrinks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrinksByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrinksByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantDrinks = action.payload;
      })
      .addCase(fetchDrinksByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRestaurantDrinks } = drinksSlice.actions;
export default drinksSlice.reducer;
