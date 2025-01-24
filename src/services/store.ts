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

const store = configureStore({
  reducer: {
    [ingredientsSlice.name]: ingredientsSlice.reducer,
    [constructorSlice.name]: constructorSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [feedsSlice.name]: feedsSlice.reducer,
    [newOrderSlice.name]: newOrderSlice.reducer,
    [userOrdersSlice.name]: userOrdersSlice.reducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
