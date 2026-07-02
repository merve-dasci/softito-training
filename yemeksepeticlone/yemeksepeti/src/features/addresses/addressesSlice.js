import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressService } from '../../services/addressService';

export const fetchUserAddresses = createAsyncThunk(
  'addresses/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await addressService.getByUserId(userId);
    } catch (error) {
      return rejectWithValue(error.message || 'Adresleriniz yüklenemedi!');
    }
  }
);

export const createAddress = createAsyncThunk(
  'addresses/create',
  async (addressData, { rejectWithValue }) => {
    try {
      return await addressService.create(addressData);
    } catch (error) {
      return rejectWithValue(error.message || 'Adres eklenemedi!');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/delete',
  async (addressId, { rejectWithValue }) => {
    try {
      await addressService.delete(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message || 'Adres silinemedi!');
    }
  }
);

const addressesSlice = createSlice({
  name: 'addresses',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => String(a.id) !== String(action.payload));
      });
  },
});

export default addressesSlice.reducer;
