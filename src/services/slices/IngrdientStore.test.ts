import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import {
  ingredientsSlice,
  getIngredientsList,
  selectIngredients,
  selectLoading,
  selectError
} from './IngredientStore';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Мокаю API-запрос
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

// Устанавливаю тайм-аут для всех тестов
jest.setTimeout(10000);

describe('ingredientsSlice', () => {
  let store: EnhancedStore<
    {
      ingredients: {
        ingredients: Array<TIngredient>;
        loading: boolean;
        error: string | null;
      };
    },
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<
            {
              ingredients: {
                ingredients: Array<TIngredient>;
                loading: boolean;
                error: string | null;
              };
            },
            undefined,
            UnknownAction
          >;
        }>,
        StoreEnhancer
      ]
    >
  >;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsSlice.reducer // Использую reducer из ingredientsSlice
      }
    });
  });

  it('Значение loading должно быть равно true, когда запрос находится в процессе выполнения (pending)', async () => {
    // Мокаю успешный ответ от API
    (getIngredientsApi as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Ingredient 1' }
    ]);

    // Диспатчу экшен
    store.dispatch(getIngredientsList());

    // Проверяю, что loading равно true, так как запрос в pending
    let loading = selectLoading(store.getState());
    expect(loading).toBe(true);

    // Жду, пока асинхронный экшен завершится
    await store.dispatch(getIngredientsList()).unwrap(); // Ожидаем завершения

    // Получаю состояние после завершения запроса
    loading = selectLoading(store.getState());

    // Проверяю, что loading теперь false, так как запрос завершился
    expect(loading).toBe(false);
  });

  it('Тест для корректной обработки ошибки в случае неудачного выполнения запроса', async () => {
    const errorMessage = 'Ошибка при загрузке';
    // Мокаю ошибку от API
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Диспатчу экшен
    store.dispatch(getIngredientsList());

    // Проверяю, что loading равно true, пока запрос выполняется
    let loading = selectLoading(store.getState());
    let error = selectError(store.getState());
    expect(loading).toBe(true); // Мы проверяем, что загрузка началась
    expect(error).toBeNull(); // Ошибки нет

    // Жду, пока асинхронный экшен завершится
    await store.dispatch(getIngredientsList()).unwrap(); // Ожидаем завершения

    // Получаю состояние после завершения запроса
    loading = selectLoading(store.getState());
    error = selectError(store.getState());

    // Проверяю, что loading теперь false и ошибка была установлена
    expect(loading).toBe(false);
    expect(error).toBe(errorMessage);
  });

  it('Тест для корректной установки ингредиентов при успешном выполнении запроса', async () => {
    const mockData: TIngredient[] = [
      {
        id: '1',
        name: 'Ingredient 1',
        _id: '',
        type: '',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockData);

    // Диспатчу экшен
    await store.dispatch(getIngredientsList());

    // Жду, пока асинхронный экшен завершится
    await store.dispatch(getIngredientsList()).unwrap(); // Ожидаем завершения

    // Проверяю, что ingredients обновился и loading стал false
    const ingredients = selectIngredients(store.getState());
    const loading = selectLoading(store.getState());

    expect(ingredients).toEqual(mockData);
    expect(loading).toBe(false);
  });
});
