import {
  IGetUsers,
  ILogin,
  ILoginResponse,
  IRegister,
  IRegisterResponse,
  IRemoveUser,
} from './types';
import AxiosInstance from '../instance';
import { Endpoints } from '../endpoints';

export const Login: ILogin = (params) =>
  AxiosInstance.post<ILoginResponse>(Endpoints.AUTH.LOGIN, params);

export const Register: IRegister = (params) =>
  AxiosInstance.post<IRegisterResponse>(Endpoints.AUTH.REGISTER, params);

export const Logout = () => AxiosInstance.get<void>(Endpoints.AUTH.LOGOUT);

export const GetUsers: IGetUsers = () =>
  AxiosInstance.get<Array<IRegisterResponse>>(Endpoints.AUTH.ROOT);

export const RemoveUser: IRemoveUser = (id) =>
  AxiosInstance.delete<string>(Endpoints.AUTH.USER, { params: { id } });
