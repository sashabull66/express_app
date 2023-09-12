import { IGetTodos, ITodosResponse, IUpdateTodo, IRemoveTodo, IAddTodo } from './types';
import AxiosInstance from '../instance';
import { Endpoints } from '../endpoints';

export const GetTodos: IGetTodos = () => AxiosInstance.get<ITodosResponse[]>(Endpoints.TODOS.ALL);

export const UpdateTodo: IUpdateTodo = (params) =>
  AxiosInstance.patch<string>(Endpoints.TODOS.TODO, params);

export const RemoveTodo: IRemoveTodo = (id) =>
  AxiosInstance.delete<string>(Endpoints.TODOS.TODO, { params: { id } });

export const AddTodo: IAddTodo = (params) =>
  AxiosInstance.post<string>(Endpoints.TODOS.TODO, params);
