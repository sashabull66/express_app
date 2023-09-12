import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRegisterResponse } from '../../api/auth/types';

export interface IAdminState {
  isLoading: boolean;
  error: string | null;
  users: Array<IRegisterResponse> | null;
}

export const initialState: IAdminState = {
  users: null,
  isLoading: true,
  error: null,
};

const AdminReducer = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    getUsersStart: (state) => ({
      ...state,
      isLoading: true,
    }),
    getUsersSuccess: (state, action: PayloadAction<IRegisterResponse[]>) => ({
      ...state,
      isLoading: false,
      error: null,
      users: action.payload,
    }),
    getUsersFailure: (state, action: PayloadAction<string>) => ({
      ...state,
      isLoading: false,
      error: action.payload,
    }),
    removeUsersData: (): IAdminState => initialState,
  },
});

export const { getUsersStart, getUsersSuccess, getUsersFailure, removeUsersData } =
  AdminReducer.actions;

export default AdminReducer.reducer;
