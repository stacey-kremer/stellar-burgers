import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/IngredientStore';
import { feedsSlice } from './slices/orderFeed';
import { newOrderSlice } from './slices/orderCreation';
import { constructorSlice } from './slices/burgerDraft';
import { userSlice } from './slices/userState';
import { userOrdersSlice } from './slices/ordersHistory';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Настроить store с использованием configureStore
export const store = configureStore({
  reducer: {
    [ingredientsSlice.name]: ingredientsSlice.reducer,
    [constructorSlice.name]: constructorSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [feedsSlice.name]: feedsSlice.reducer,
    [newOrderSlice.name]: newOrderSlice.reducer,
    [userOrdersSlice.name]: userOrdersSlice.reducer
  },
  devTools: process.env.NODE_ENV !== 'production' // Включение devTools только в режиме разработки
});

// Типы для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Хуки для dispatch и selector
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
