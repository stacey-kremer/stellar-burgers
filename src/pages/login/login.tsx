import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { login } from '../../services/slices/userState';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const localStorageEmail = localStorage.getItem('email') ?? '';
  const [email, setEmail] = useState(localStorageEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    localStorage.setItem('email', email);
    dispatch(login({ email, password })).catch((error) => {
      setError('Ошибка при входе. Проверьте ваши данные и попробуйте снова.');
    });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
