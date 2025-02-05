import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Создаем асинхронное действие для получения списка ингредиентов
export const getIngredientsList = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { dispatch, getState }) => {
    const response = await fetch('API_URL');
    return response.json();
  }
);

// В файле `IngredientStore`
export const getIngredientsErrorState = (state: {
  ingredients: { error: any };
}) => state.ingredients.error;

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
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
  // Обработчики для асинхронных действий
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error'; // если ошибка без message
      })
      .addCase(getIngredientsList.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const selectIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.ingredients;
export const selectLoading = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.loading;
export const selectError = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
