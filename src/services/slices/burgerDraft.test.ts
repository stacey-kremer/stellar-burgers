import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import constructorReducer, {
  addItem,
  deleteItem,
  deleteBun,
  clearAll
} from './burgerDraft';
import { TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  // Создаю переменную для хранения состояния хранилища
  let store: EnhancedStore<
    {
      constructorIngredient: {
        bun: TConstructorIngredient | null; // Булочка может быть null, если не выбрана
        ingredients: TConstructorIngredient[]; // Массив ингредиентов конструктора
      };
    },
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<
            {
              constructorIngredient: {
                bun: TConstructorIngredient | null;
                ingredients: TConstructorIngredient[];
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

  // Каждый раз перед тестами инициализирую store с редюсером конструктора
  beforeEach(() => {
    store = configureStore({
      reducer: {
        constructorIngredient: constructorReducer // Устанавливаю редюсер для работы с состоянием конструктора
      }
    });
  });

  // Функция для создания тестовых ингредиентов с уникальными id
  const createIngredient = (
    name: string,
    type: string = 'main' // По умолчанию тип ингредиента "main"
  ): TConstructorIngredient => ({
    _id: crypto.randomUUID(), // Генерация уникального _id для каждого ингредиента
    id: crypto.randomUUID(), // Генерация уникального id для совместимости с типом
    name,
    type,
    price: 20,
    proteins: 1,
    fat: 0,
    carbohydrates: 5,
    calories: 30,
    image: 'image_url_here',
    image_large: 'image_large_url_here',
    image_mobile: 'image_mobile_url_here'
  });

  // Тест добавления булочки в конструктор
  test('Тест добавления булочки в конструктор', () => {
    const bun = createIngredient('Булка', 'bun');

    store.dispatch(addItem(bun)); // Добавляю булочку в конструктор
    const state = store.getState().constructorIngredient; // Получаю состояние конструктора

    // Проверяю, что булочка добавлена правильно
    expect(state.bun).toEqual(
      expect.objectContaining({
        name: 'Булка',
        type: 'bun',
        price: 20
      })
    );
  });

  // Тест добавления обычного ингредиента в конструктор
  test('Тест добавления обычного ингредиента в конструктор', () => {
    const ingredient = createIngredient('Лук');

    store.dispatch(addItem(ingredient)); // Добавляю ингредиент
    const state = store.getState().constructorIngredient; // Получаю состояние конструктора

    // Проверяю, что ингредиент добавлен в массив ingredients
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        name: 'Лук',
        type: 'main'
      })
    );
  });

  // Тест удаления ингредиента из конструктора
  test('Тест удаления ингредиента из конструктора', () => {
    const ingredient = createIngredient('Лук');

    store.dispatch(addItem(ingredient)); // Добавляю ингредиент
    const stateAfterAdd = store.getState().constructorIngredient; // Получаю состояние после добавления
    const addedIngredient = stateAfterAdd.ingredients[0]; // Сохраняю добавленный ингредиент для удаления

    store.dispatch(deleteItem(addedIngredient)); // Удаляю ингредиент по id
    const stateAfterDelete = store.getState().constructorIngredient; // Получаю состояние после удаления

    // Проверяю, что ингредиент больше не содержится в массиве ingredients
    expect(stateAfterDelete.ingredients).not.toContainEqual(
      expect.objectContaining({ id: addedIngredient.id })
    );
  });

  // Тест удаления булочки из конструктора
  test('Тест удаления булочки из конструктора', () => {
    const bun = createIngredient('Булка', 'bun');

    store.dispatch(addItem(bun)); // Добавляю булочку
    store.dispatch(deleteBun()); // Удаляю булочку

    const state = store.getState().constructorIngredient; // Получаю состояние конструктора

    // Проверяю, что булочка удалена (она должна быть null)
    expect(state.bun).toBeNull();
  });

  // Тест очистки всех ингредиентов
  test('Тест очистки всех ингредиентов', () => {
    const bun = createIngredient('Булка', 'bun');
    const ingredient = createIngredient('Лук');

    store.dispatch(addItem(bun)); // Добавляю булочку
    store.dispatch(addItem(ingredient)); // Добавляю ингредиент
    store.dispatch(clearAll()); // Очищаю конструктор

    const state = store.getState().constructorIngredient; // Получаю состояние конструктора

    // Проверяю, что все ингредиенты очищены
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
