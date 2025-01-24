import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

// Слайс для управления состоянием конструктора
export const constructorSlice = createSlice({
  name: 'constructorIngredient',
  initialState,
  reducers: {
    // Добавление ингредиента
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    // Удаление ингредиента
    deleteItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    // Очистка всех ингредиентов и булочек
    clearAll: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    // Обновление всех ингредиентов
    updateAll: (state, action: PayloadAction<TConstructorIngredient[]>) => {
      state.ingredients = action.payload;
    }
  }
});

export const { addItem, deleteItem, clearAll, updateAll } =
  constructorSlice.actions;

export const selectBun = (state: {
  constructorIngredient: TConstructorState;
}) => state.constructorIngredient.bun;

export const selectIngredients = (state: {
  constructorIngredient: TConstructorState;
}) => state.constructorIngredient.ingredients;

export default constructorSlice.reducer;
