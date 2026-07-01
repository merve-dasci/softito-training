import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async Thunk to fetch categories from JSON Server
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getCategories()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories')
    }
  }
)

const initialState = {
  categories: [],
  selectedCategory: 'All',
  loading: false,
  error: null
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load categories'
      })
  }
})

export const { setCategories, setSelectedCategory } = categorySlice.actions
export default categorySlice.reducer
