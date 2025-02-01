import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectOrders,
  selectTotal,
  selectTotalToday
} from '../../services/slices/orderFeed';

// Функция для фильтрации заказов по статусу и получения первых 30 номеров
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 30);

export const FeedInfo: FC = () => {
  // Получаем все заказы, общее число заказов и число заказов за сегодня из состояния Redux
  const orders = useSelector(selectOrders);
  const totalFeeds = useSelector(selectTotal);
  const totalToday = useSelector(selectTotalToday);
  // Используем useMemo для мемоизации результатов фильтрации заказов по статусам
  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{
        total: totalFeeds,
        totalToday: totalToday
      }}
    />
  );
};
