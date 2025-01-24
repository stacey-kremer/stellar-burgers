import { getOrdersApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Создаем асинхронное действие для получения заказов пользователя
export const getUserOrders = createAsyncThunk('orders/ofUser', getOrdersApi);

export interface TOrdersState {
  orders: Array<TOrder>;
  isLoading: boolean;
  error: string | null;
}

const initialState: TOrdersState = {
  orders: [],
  isLoading: true,
  error: null
};

// Создаем слайс для управления состоянием заказов пользователя
export const userOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      });
  }
});

export const selectOrders = (state: { orders: TOrdersState }) =>
  state.orders.orders;
export const selectIsLoading = (state: { orders: TOrdersState }) =>
  state.orders.isLoading;
export const selectError = (state: { orders: TOrdersState }) =>
  state.orders.error;

export default userOrdersSlice.reducer;
