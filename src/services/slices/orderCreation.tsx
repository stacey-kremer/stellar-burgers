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
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
  },
  // Обработчики для асинхронных действий
  extraReducers: (builder) => {
    builder
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.error = undefined;
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(placeNewOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = undefined;
      });
  }
});

export const { resetOrder } = newOrderSlice.actions;
export const { getOrderRequest, getOrderModalData } = newOrderSlice.selectors;

export default newOrderSlice.reducer;
