import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalPrice: 0, totalAmount: 0 };
  } catch (error) {
    return { items: [], totalPrice: 0, totalAmount: 0 };
  }
};

const saveCartToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    totalPrice: state.totalPrice,
    totalAmount: state.totalAmount
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCart(),
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload; // { id, name, price, image, restaurantId, itemType }
      
      // Enforce single restaurant rule in reducer
      if (state.items.length > 0 && String(state.items[0].restaurantId) !== String(newItem.restaurantId)) {
        return;
      }
      
      const itemType = newItem.itemType || 'product';
      const cartItemId = `${itemType}-${newItem.id}`;
      
      const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          itemType,
          cartItemId,
          quantity: 1,
        });
      } else {
        existingItem.quantity++;
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
      
      state.totalAmount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      saveCartToStorage(state);
    },
    incrementQuantity: (state, action) => {
      const cartItemId = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      if (item) {
        item.quantity++;
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      saveCartToStorage(state);
    },
    decrementQuantity: (state, action) => {
      const cartItemId = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
        } else {
          item.quantity--;
        }
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
