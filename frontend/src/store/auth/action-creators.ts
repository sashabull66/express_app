import { ILoginRequest, IRegisterRequest } from '../../api/auth/types';
import { Dispatch } from '@reduxjs/toolkit';
import { loginFailure, loginStart, loginSuccess, logoutSuccess } from './auth-reducer';
import api from '../../api';

export const LoginUser =
  (params: ILoginRequest, callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(loginStart());
      const result = await api.auth.Login(params);

      dispatch(loginSuccess(result.data));
      localStorage.setItem('user', JSON.stringify(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(loginFailure((e as Error).message));
    }
  };

export const RegisterUser =
  (params: IRegisterRequest, callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(loginStart());
      await api.auth.Register(params);

      if (callback) callback();
    } catch (e) {
      dispatch(loginFailure((e as Error).message));
    }
  };

export const LogoutUser =
  (callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.auth.Logout();

      dispatch(logoutSuccess());
      localStorage.removeItem('user');

      if (callback) callback();
    } catch (e) {
      console.error((e as Error).message);
    }
  };
