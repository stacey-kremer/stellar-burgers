import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUser } from '../../services/slices/userState';

type FormValue = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [formValue, setFormValue] = useState<FormValue>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    formValue.password !== '';

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!formValue.name || !formValue.email || !formValue.password) {
      return;
    }
    dispatch(updateUser(formValue));
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!isFormChanged) return;

    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
