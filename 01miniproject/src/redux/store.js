import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import categoryReducer from './slices/categorySlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer
  }
})

export default store
