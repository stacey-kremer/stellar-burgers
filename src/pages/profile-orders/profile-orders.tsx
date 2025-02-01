import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { getUserOrders } from '../../services/slices/ordersHistory';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await dispatch(getUserOrders());
      } catch (error) {
        setError('Не удалось загрузить заказы');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [dispatch]);
  const orders = useSelector(
    (state: { orders: { orders: TOrder[] } }) => state.orders.orders
  );

  if (error) {
    return <div>{error}</div>;
  }
  return <ProfileOrdersUI orders={orders} />;
};
