import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Ürünler yüklenemedi!');
    }
  }
);

export const fetchProductsByRestaurant = createAsyncThunk(
  'products/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await productService.getByRestaurantId(restaurantId);
    } catch (error) {
      return rejectWithValue(error.message || 'Restoran ürünleri yüklenemedi!');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/add',
  async (productData, { rejectWithValue }) => {
    try {
      return await productService.create(productData);
    } catch (error) {
      return rejectWithValue(error.message || 'Ürün eklenemedi!');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Ürün silinemedi!');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    restaurantProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRestaurantProducts: (state) => {
      state.restaurantProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By Restaurant
      .addCase(fetchProductsByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantProducts = action.payload;
      })
      .addCase(fetchProductsByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.restaurantProducts.push(action.payload);
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        state.restaurantProducts = state.restaurantProducts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearRestaurantProducts } = productsSlice.actions;
export default productsSlice.reducer;
