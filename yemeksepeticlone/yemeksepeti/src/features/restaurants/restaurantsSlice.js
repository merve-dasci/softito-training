import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantService } from '../../services/restaurantService';

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await restaurantService.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Restoranlar yüklenemedi!');
    }
  }
);

export const fetchRestaurantDetail = createAsyncThunk(
  'restaurants/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await restaurantService.getById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Restoran detayı yüklenemedi!');
    }
  }
);

export const addRestaurant = createAsyncThunk(
  'restaurants/add',
  async (restaurantData, { rejectWithValue }) => {
    try {
      return await restaurantService.create(restaurantData);
    } catch (error) {
      return rejectWithValue(error.message || 'Restoran eklenemedi!');
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurants/delete',
  async (id, { rejectWithValue }) => {
    try {
      await restaurantService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Restoran silinemedi!');
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurants/update',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      return await restaurantService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Restoran güncellenemedi!');
    }
  }
);

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: [],
    selectedRestaurant: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Detail
      .addCase(fetchRestaurantDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(fetchRestaurantDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Delete
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
        if (state.selectedRestaurant?.id === action.payload) {
          state.selectedRestaurant = null;
        }
      })
      // Update
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.list = state.list.map((r) => r.id === action.payload.id ? action.payload : r);
        if (state.selectedRestaurant?.id === action.payload.id) {
          state.selectedRestaurant = action.payload;
        }
      });
  },
});

export const { clearSelectedRestaurant } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
