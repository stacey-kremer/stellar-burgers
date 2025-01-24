import { FC, memo, useMemo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  // useMemo используется для оптимизации - сортируем заказы по дате
  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  return <OrdersListUI orderByDate={sortedOrders} />;
});
