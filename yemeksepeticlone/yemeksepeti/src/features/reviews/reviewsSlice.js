import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services/reviewService';

export const fetchRestaurantReviews = createAsyncThunk(
  'reviews/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await reviewService.getByRestaurantId(restaurantId);
    } catch (error) {
      return rejectWithValue(error.message || 'Yorumlar yüklenemedi!');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      return await reviewService.create(reviewData);
    } catch (error) {
      return rejectWithValue(error.message || 'Değerlendirme kaydedilemedi!');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRestaurantReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;
