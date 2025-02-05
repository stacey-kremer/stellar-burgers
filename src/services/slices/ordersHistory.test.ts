import { configureStore } from '@reduxjs/toolkit';
import userOrdersReducer, { getUserOrders } from './ordersHistory';
import { getOrdersApi } from '@api';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

describe('userOrdersSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: userOrdersReducer
      }
    });
  });

  test('Тест для корректной обработки состояния ожидания, когда вызывается getUserOrders', async () => {
    // Мокаю запрос getOrdersApi, чтобы он сразу вернул результат
    (getOrdersApi as jest.Mock).mockResolvedValueOnce([]);

    // Проверяю начальное состояние
    let state = store.getState().orders;
    expect(state.isLoading).toBe(true); // Начальное состояние loading должно быть true

    // Диспатчу экшен
    await store.dispatch(getUserOrders());

    state = store.getState().orders;
    // Проверяю, что состояние загрузки установилось в false после выполнения асинхронного запроса
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Тест для корректной обработки успешно выполненного getUserOrders', async () => {
    // Мокаю успешный ответ от API
    const mockOrders = [
      { id: '1', name: 'Order 1', status: 'done' },
      { id: '2', name: 'Order 2', status: 'pending' }
    ];

    (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockOrders);

    // Диспатчу экшен
    await store.dispatch(getUserOrders());

    const state = store.getState().orders;

    // Проверяю успешное изменение состояния
    expect(state.orders).toEqual(mockOrders);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Тест для корректной обработки состояния ошибки, когда getUserOrders завершается с ошибкой', async () => {
    // Мокаю ошибку от API
    const errorMessage = 'Произошла ошибка';
    (getOrdersApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Диспатчу экшен
    await store.dispatch(getUserOrders());

    const state = store.getState().orders;

    // Проверяю состояние после неудачного запроса
    expect(state.orders).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
