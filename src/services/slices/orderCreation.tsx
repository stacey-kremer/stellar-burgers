import { orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Создаем асинхронное действие для размещения нового заказа
export const placeNewOrder = createAsyncThunk(
  'order/createOrder',
  orderBurgerApi
);

export interface TNewOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | undefined;
}

const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: undefined
};

// Создаем слайс для управления состоянием нового заказа
export const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    resetOrder: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.error = undefined;
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      .addCase(placeNewOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = undefined;
      });
  }
});

// Экспортируем редьюсер по умолчанию
export const { resetOrder } = newOrderSlice.actions;

export default newOrderSlice.reducer;

// Селекторы отдельно
export const getOrderRequest = (state: { newOrder: TNewOrderState }) =>
  state.newOrder.orderRequest;
export const getOrderModalData = (state: { newOrder: TNewOrderState }) =>
  state.newOrder.orderModalData;
