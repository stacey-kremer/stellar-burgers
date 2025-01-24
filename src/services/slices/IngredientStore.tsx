import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Создаем асинхронное действие для получения списка ингредиентов
export const getIngredientsList = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null | undefined;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

// Создаем слайс для ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsState: (state) => state,
    getIngredientsLoadingState: (state) => state.loading,
    getIngredients: (state) => state.ingredients
  },
  // Обработчики для асинхронных действий
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredientsList.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  getIngredientsState,
  getIngredientsLoadingState,
  getIngredients
} = ingredientsSlice.selectors;
