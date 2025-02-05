import { store } from '../store';
import { register, login, apiGetUser, updateUser, logout } from './userState';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { TUser, TError } from '@utils-types';

// Мокаю все API функции
jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

describe('Тесты для userState', () => {
  const userData: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const errorData: TError = {
    message: 'Ошибка при выполнении запроса'
  };

  it('успешная регистрация', async () => {
    // Мокаю успешную регистрацию
    (registerUserApi as jest.Mock).mockResolvedValue({
      user: userData
    });

    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Диспатчу экшен регистрации
    await store.dispatch(register(registerData));

    // Проверяю, что стейт пользователя обновился
    const state = store.getState();
    expect(state.user.user.email).toBe(userData.email);
    expect(state.user.user.name).toBe(userData.name);
    expect(state.user.isAuthChecked).toBe(true);
    expect(state.user.error).toBeUndefined();
  });

  it('ошибка при регистрации', async () => {
    // Мокаю ошибку при регистрации
    (registerUserApi as jest.Mock).mockRejectedValue({
      message: 'Ошибка при регистрации'
    });

    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Диспатчу экшен регистрации
    await store.dispatch(register(registerData));

    // Проверяю, что стейт ошибки был обновлен
    const state = store.getState();
    expect(state.user.error).toEqual({ message: 'Ошибка при регистрации' });
    expect(state.user.isAuthChecked).toBe(false);
  });

  it('успешный логин', async () => {
    // Мокаю успешный логин
    (loginUserApi as jest.Mock).mockResolvedValue({
      user: userData
    });

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Диспатчу экшен логина
    await store.dispatch(login(loginData));

    // Проверяю, что стейт пользователя обновился
    const state = store.getState();
    expect(state.user.user.email).toBe(userData.email);
    expect(state.user.user.name).toBe(userData.name);
    expect(state.user.isAuthChecked).toBe(true);
    expect(state.user.error).toBeUndefined();
  });

  it('ошибка при логине', async () => {
    // Мокаю ошибку при логине
    (loginUserApi as jest.Mock).mockRejectedValue(errorData);

    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    // Диспатчу экшен логина
    await store.dispatch(login(loginData));

    // Проверяю, что стейт ошибки был обновлен
    const state = store.getState();
    expect(state.user.error).toEqual(errorData);
    expect(state.user.isAuthChecked).toBe(false);
  });

  it('успешное получение данных пользователя', async () => {
    // Мокаю успешное получение данных пользователя
    (getUserApi as jest.Mock).mockResolvedValue({
      user: userData
    });

    // Диспатчу экшен для получения данных пользователя
    await store.dispatch(apiGetUser());

    // Проверяю, что стейт пользователя обновился
    const state = store.getState();
    expect(state.user.user.email).toBe(userData.email);
    expect(state.user.user.name).toBe(userData.name);
    expect(state.user.isAuthChecked).toBe(true);
    expect(state.user.error).toBeUndefined();
  });

  it('ошибка при получении данных пользователя', async () => {
    // Мокаю ошибку при получении данных пользователя
    (getUserApi as jest.Mock).mockRejectedValue(errorData);

    // Диспатчу экшен для получения данных пользователя
    await store.dispatch(apiGetUser());

    // Проверяю, что стейт ошибки был обновлен
    const state = store.getState();
    expect(state.user.error).toEqual(errorData);
    expect(state.user.isAuthChecked).toBe(false);
  });

  it('успешное обновление пользователя', async () => {
    // Мокаю успешное обновление данных пользователя
    const updatedUserData: TUser = {
      email: 'updated@example.com',
      name: 'Updated User'
    };

    (updateUserApi as jest.Mock).mockResolvedValue({
      user: updatedUserData
    });

    const updateData = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    // Диспатчу экшен обновления пользователя
    await store.dispatch(updateUser(updateData));

    // Проверяю, что стейт пользователя был обновлен
    const state = store.getState();
    expect(state.user.user.email).toBe(updatedUserData.email);
    expect(state.user.user.name).toBe(updatedUserData.name);
    expect(state.user.isAuthChecked).toBe(true);
    expect(state.user.error).toBeUndefined();
  });

  it('ошибка при обновлении пользователя', async () => {
    // Мокаю ошибку при обновлении данных пользователя
    (updateUserApi as jest.Mock).mockRejectedValue(errorData);

    const updateData = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    // Диспатчу экшен обновления пользователя
    await store.dispatch(updateUser(updateData));

    // Проверяю, что стейт ошибки был обновлен
    const state = store.getState();
    expect(state.user.error).toEqual(errorData);
    expect(state.user.isAuthChecked).toBe(false);
  });

  it('успешный логаут', async () => {
    // Мокаю успешный логаут
    (logoutApi as jest.Mock).mockResolvedValue({});

    // Диспатчу экшен логаута
    await store.dispatch(logout());

    // Проверяю, что стейт пользователя был сброшен
    const state = store.getState();
    expect(state.user.user.email).toBe('');
    expect(state.user.user.name).toBe('');
    expect(state.user.isAuthChecked).toBe(false);
    expect(state.user.error).toBeUndefined();
  });
});
