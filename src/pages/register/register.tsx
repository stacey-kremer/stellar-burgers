import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { TRegisterData } from '@api';
import { register } from '../../services/slices/userState';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(undefined);

    if (!email || !password || !userName) {
      setError('Все поля должны быть заполнены');
      return;
    }
    const userData: TRegisterData = {
      email: email,
      name: userName,
      password: password
    };

    try {
      await dispatch(register(userData));
    } catch (error) {
      setError('Ошибка регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
