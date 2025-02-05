import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/IngredientStore'; // Используем правильный селектор

const maxIngredients = 6; // Максимальное количество ингредиентов, которое будет отображаться в карточке заказа

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients); // Используем правильный селектор
  // Мемоизируем отображение ингредиентов, создавая объект, где ключом является _id ингредиента
  const ingredientsMap = useMemo(
    () =>
      ingredients.reduce(
        (map, ingredient) => {
          map[ingredient._id] = ingredient;
          return map;
        },
        {} as Record<string, TIngredient>
      ),
    [ingredients]
  );
  // Мемоизируем информацию о заказе
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;
    // Составляем список ингредиентов заказа, на основе их _id из заказа
    const ingredientsInfo = order.ingredients
      .map((ingredientId: string) => ingredientsMap[ingredientId])
      .filter((ingredient) => ingredient !== undefined);
    // Считаем общую стоимость ингредиентов
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    // Оставляем только maxIngredients для отображения
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    // Считаем количество ингредиентов, которые не помещаются в отображаемую часть
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredientsMap]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
