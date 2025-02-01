import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import newOrderReducer, {
  placeNewOrder,
  TNewOrderState
} from './orderCreation';
import { orderBurgerApi } from '@api';

// Мокаю API-запрос
jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('newOrderSlice', () => {
  let store: EnhancedStore<
    { newOrder: TNewOrderState },
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<
            { newOrder: TNewOrderState },
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
        newOrder: newOrderReducer // Использую редьюсер по умолчанию
      }
    });
  });

  it('Тест для корректной обработки состояния ошибки при неудачном выполнении запроса placeNewOrder', async () => {
    const errorMessage = 'Ошибка при размещении заказа';

    // Мокаю ошибку от API
    (orderBurgerApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Диспатчу асинхронный экшен
    await store.dispatch(placeNewOrder(['orderData']));

    // Получаю состояние после завершения запроса
    const state = store.getState().newOrder;

    // Проверяю, что loading стал false и ошибка была установлена
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
