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
  error: string | null; // Используем null вместо undefined для более явного состояния
}

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null // Инициализируем error как null
};

// Слайс для управления состоянием заказов
export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = null; // После успешного выполнения очищаем ошибку
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = false;
        // Переходим на использование null, если нет сообщения об ошибке
        state.error =
          action.error.message || 'Произошла ошибка при загрузке данных';
      })
      .addCase(getAllFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Устанавливаем error в null на время запроса
      });
  }
});

export const selectOrders = (state: { feeds: TFeedsState }) =>
  state.feeds.orders;
export const selectTotal = (state: { feeds: TFeedsState }) => state.feeds.total;
export const selectTotalToday = (state: { feeds: TFeedsState }) =>
  state.feeds.totalToday;

export default feedsSlice.reducer;
