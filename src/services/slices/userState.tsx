import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, TError } from '@utils-types';

// Асинхронные действия для работы с пользователем
export const apiGetUser = createAsyncThunk('user/getuser', getUserApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);
export const register = createAsyncThunk('user/register', registerUserApi);
export const login = createAsyncThunk('user/login', loginUserApi);
export const logout = createAsyncThunk('user/logout', logoutApi);

export interface TUserState {
  isAuthChecked: boolean;
  user: TUser;
  error: TError | undefined;
}

const initialState: TUserState = {
  isAuthChecked: false,
  user: { email: '', name: '' },
  error: undefined
};
// Создаем слайс для управления состоянием пользователя
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    getUser: (state) => state.user,
    getName: (state) => state.user.name,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.error = undefined;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error as TError;
      })
      .addCase(register.pending, (state) => {
        state.error = undefined;
      });
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.error = undefined;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.error as TError;
      })
      .addCase(login.pending, (state) => {
        state.isAuthChecked = false;
        state.error = undefined;
      });
    builder
      .addCase(apiGetUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.error = undefined;
      })
      .addCase(apiGetUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.error as TError;
      });
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.error = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.error as TError;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = undefined;
      });
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthChecked = false;
      state.user = { email: '', name: '' };
      state.error = undefined;
    });
  }
});

export const { isAuthCheckedSelector, getUser, getName, getError } =
  userSlice.selectors;
