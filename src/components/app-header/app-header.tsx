import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getName } from '../../services/slices/userState';

// Компонент для отображения шапки приложения
export const AppHeader: FC = () => {
  // Получаем имя пользователя из состояния через селектор
  const userName = useSelector<string>(getName);
  // Рендерим компонент шапки с именем пользователя
  return <AppHeaderUI userName={userName} />;
};
