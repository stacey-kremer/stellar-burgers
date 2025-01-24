import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TFeedsResponse } from '@utils-types';
import { getFeedsApi } from '@api';

// Создаем асинхронное действие для получения всех заказов
export const getAllFeeds = createAsyncThunk<TFeedsResponse, void>(
  'orders/getAll',
  getFeedsApi
);

export interface TFeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: undefined
};

// Слайс для управления состоянием заказов
export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  // Обработчики для асинхронного действия
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = false;
        state.error =
          action.error.message || 'Произошла ошибка при загрузке данных';
      })
      .addCase(getAllFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      });
  }
});

export const selectOrders = (state: { feeds: TFeedsState }) =>
  state.feeds.orders;
export const selectTotal = (state: { feeds: TFeedsState }) => state.feeds.total;
export const selectTotalToday = (state: { feeds: TFeedsState }) =>
  state.feeds.totalToday;
export default feedsSlice.reducer;
