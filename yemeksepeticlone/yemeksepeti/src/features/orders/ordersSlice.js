import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Siparişler yüklenemedi!');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await orderService.getByUserId(userId);
    } catch (error) {
      return rejectWithValue(error.message || 'Siparişleriniz yüklenemedi!');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.create(orderData);
    } catch (error) {
      return rejectWithValue(error.message || 'Sipariş oluşturulamadı!');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateStatus(id, status);
    } catch (error) {
      return rejectWithValue(error.message || 'Sipariş durumu güncellenemedi!');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [], // All orders for admin
    userOrders: [], // Current user's orders
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders.push(action.payload);
        state.list.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        // Update in global list
        const idx = state.list.findIndex((o) => o.id === updatedOrder.id);
        if (idx !== -1) {
          state.list[idx] = updatedOrder;
        }
        // Update in user list
        const uIdx = state.userOrders.findIndex((o) => o.id === updatedOrder.id);
        if (uIdx !== -1) {
          state.userOrders[uIdx] = updatedOrder;
        }
      });
  },
});

export default ordersSlice.reducer;
