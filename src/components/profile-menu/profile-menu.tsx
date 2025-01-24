import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/userState';

// Основной компонент меню профиля
export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  // Обработчик выхода из профиля
  const onLogout = () => {
    dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={onLogout} pathname={pathname} />;
};
