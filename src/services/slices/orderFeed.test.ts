import { configureStore } from '@reduxjs/toolkit';
import { getAllFeeds, feedsSlice } from './orderFeed';
import { getFeedsApi } from '@api';

// Мокирую API запрос
jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedsSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feeds: feedsSlice.reducer
      }
    });
  });

  test('Тест для корректной обработки состояния pending при вызове getAllFeeds»', async () => {
    // Мокаю getFeedsApi, чтобы он сразу вернул результат
    (getFeedsApi as jest.Mock).mockResolvedValueOnce({
      orders: [],
      total: 0,
      totalToday: 0
    });

    // Диспатчу экшен
    const dispatchPromise = store.dispatch(getAllFeeds());

    // Проверяю, что состояние загрузки установилось в true
    const stateBefore = store.getState().feeds;
    expect(stateBefore.isLoading).toBe(true); // Проверяю, что isLoading установлено в true сразу после вызова

    // Дожидаюсь завершения асинхронного действия
    await dispatchPromise;

    const stateAfter = store.getState().feeds;
    expect(stateAfter.isLoading).toBe(false); // После завершения запроса, isLoading должно быть false
    expect(stateAfter.error).toBeNull(); // Проверяю, что ошибка равна null
  });

  test('Тесты для корректной обработки завершённого состояния, когда getAllFeeds выполняется успешно', async () => {
    // Мокаю успешный ответ от API
    (getFeedsApi as jest.Mock).mockResolvedValueOnce({
      orders: [{ id: '1', name: 'Order 1' }],
      total: 100,
      totalToday: 10
    });

    // Диспатчу экшен
    await store.dispatch(getAllFeeds());

    const state = store.getState().feeds;

    // Проверяю успешное изменение состояния
    expect(state.orders).toEqual([{ id: '1', name: 'Order 1' }]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Тест для корректной обработки состояния сбоя, когда getAllFeeds завершается с ошибкой', async () => {
    // Мокаю ошибку от API
    const errorMessage = 'Произошла ошибка';
    (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Диспатчу экшен
    await store.dispatch(getAllFeeds());

    const state = store.getState().feeds;

    // Проверяю состояние после неудачного запроса
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
