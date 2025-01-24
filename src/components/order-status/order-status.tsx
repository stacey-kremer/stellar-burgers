import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

type Status = 'pending' | 'done' | 'created';

// Сопоставление статусов с текстами
const statusText: Record<Status, string> = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};
// Сопоставление статусов с цветами
const statusColor: Record<Status, string> = {
  pending: '#E52B1A',
  done: '#00CCCC',
  created: '#F2F2F3'
};

// Основной компонент для отображения статуса заказа
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  if (status !== 'pending' && status !== 'done' && status !== 'created') {
    return <OrderStatusUI textStyle='#F2F2F3' text='Неизвестный статус' />;
  }
  // Для допустимого статуса, получаем текст и цвет
  const text = statusText[status];
  const textStyle = statusColor[status];
  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
