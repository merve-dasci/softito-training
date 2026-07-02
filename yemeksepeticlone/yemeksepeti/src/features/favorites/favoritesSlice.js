import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoriteService } from '../../services/favoriteService';

export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await favoriteService.getByUserId(userId);
    } catch (error) {
      return rejectWithValue(error.message || 'Favoriler yüklenemedi!');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async ({ userId, restaurantId, favoriteId }, { rejectWithValue }) => {
    try {
      if (favoriteId) {
        await favoriteService.delete(favoriteId);
        return { isFavorite: false, favoriteId, restaurantId };
      } else {
        const data = await favoriteService.create(userId, restaurantId);
        return { isFavorite: true, favorite: data, restaurantId };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Favori işlemi başarısız!');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { isFavorite, favoriteId, favorite } = action.payload;
        if (isFavorite) {
          state.list.push(favorite);
        } else {
          state.list = state.list.filter((f) => String(f.id) !== String(favoriteId));
        }
      });
  },
});

export default favoritesSlice.reducer;
