import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/IngredientStore';

// Компонент для отображения информации о заказе
export const OrderInfo: FC = () => {
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const { number } = useParams();
  const ingredients: TIngredient[] = useSelector(getIngredients);
  // Мемоизируем информацию о заказе, включая ингредиенты и общую стоимость
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    // Создаем Map для быстрого доступа к ингредиентам по их _id
    const ingredientsMap = new Map(
      ingredients.map((ingredient) => [ingredient._id, ingredient])
    );
    // Составляем объект с ингредиентами и их количеством в заказе
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredient & { count: number } }, item) => {
        const ingredient = ingredientsMap.get(item); // Получаем ингредиент по _id из Map
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = { ...ingredient, count: 1 };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );
    // Считаем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    // Возвращаем объект с полной информацией о заказе
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  useEffect(() => {
    if (number) {
      getOrderByNumberApi(Number(number)).then((data) => {
        setOrderData(data.orders[0]);
      });
    }
  }, [number]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
