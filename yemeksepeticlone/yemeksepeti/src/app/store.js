import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import restaurantsReducer from '../features/restaurants/restaurantsSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import drinksReducer from '../features/drinks/drinksSlice';
import saucesReducer from '../features/sauces/saucesSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import addressesReducer from '../features/addresses/addressesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantsReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    drinks: drinksReducer,
    sauces: saucesReducer,
    reviews: reviewsReducer,
    favorites: favoritesReducer,
    addresses: addressesReducer,
  },
});
