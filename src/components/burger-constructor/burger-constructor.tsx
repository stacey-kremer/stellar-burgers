import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearAll,
  selectBun,
  selectIngredients
} from '../../services/slices/burgerDraft';
import { useDispatch, useSelector } from '../../services/store';
import {
  placeNewOrder,
  getOrderModalData,
  getOrderRequest,
  resetOrder
} from '../../services/slices/orderCreation';
import { isAuthCheckedSelector } from '../../services/slices/userState';
import { useNavigate } from 'react-router-dom';

// Компонент конструктора бургера
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем булочки и ингредиенты из состояния
  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectIngredients);

  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  // Проверяем, авторизован ли пользователь
  const isAuth = useSelector(isAuthCheckedSelector);
  // Если пользователь не авторизован, перенаправляем на страницу логина
  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;
    // Формируем данные для отправки на сервер
    const orderData = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id)
    ];
    // Отправляем данные на создание нового заказа
    dispatch(placeNewOrder(orderData));
  };
  // Закрытие модального окна с заказом
  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(clearAll());
    navigate('/');
  };
  // Расчет общей стоимости
  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0; // Булочка используется дважды (вверху и внизу)
    const ingredientsPrice = ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price, // Суммируем цены всех ингредиентов
      0
    );
    return bunPrice + ingredientsPrice; // Возвращаем общую цену
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
