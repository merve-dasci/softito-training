import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload
      const existingItem = state.cartItems.find(item => item.id === newItem.id)
      
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          category: newItem.category,
          price: newItem.price,
          image: newItem.image,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.price * (newItem.quantity || 1)
        })
      } else {
        const qtyToAdd = newItem.quantity || 1
        existingItem.quantity += qtyToAdd
        existingItem.totalPrice += existingItem.price * qtyToAdd
      }
      
      // Update totals
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
    },
    removeFromCart: (state, action) => {
      const id = action.payload
      state.cartItems = state.cartItems.filter(item => item.id !== id)
      
      // Update totals
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
    },
    increaseQuantity: (state, action) => {
      const id = action.payload
      const item = state.cartItems.find(item => item.id === id)
      if (item) {
        item.quantity++
        item.totalPrice += item.price
      }
      
      // Update totals
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload
      const item = state.cartItems.find(item => item.id === id)
      if (item) {
        if (item.quantity === 1) {
          state.cartItems = state.cartItems.filter(item => item.id !== id)
        } else {
          item.quantity--
          item.totalPrice -= item.price
        }
      }
      
      // Update totals
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0)
    },
    clearCart: (state) => {
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
    }
  }
})

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
