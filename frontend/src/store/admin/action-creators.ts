import { Dispatch } from '@reduxjs/toolkit';
import { getUsersFailure, getUsersStart, getUsersSuccess } from './admin-reducer';
import api from '../../api';

export const GetAllUsers =
  (callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(getUsersStart());
      const result = await api.auth.GetUsers();

      dispatch(getUsersSuccess(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(getUsersFailure((e as Error).message));
    }
  };

export const RemoveUser =
  (usrId: string, callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(getUsersStart());
      await api.auth.RemoveUser(usrId);
      const result = await api.auth.GetUsers();

      dispatch(getUsersSuccess(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(getUsersFailure((e as Error).message));
    }
  };
