import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (errror) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Неизвестная ошибка'));
      }
    }
  };

  useEffect(() => {
    const resetPasswordToken = localStorage.getItem('resetPassword');
    if (!resetPasswordToken) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
