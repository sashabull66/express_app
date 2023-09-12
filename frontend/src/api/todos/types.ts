import { AxiosPromise } from 'axios';

export interface ITodosResponse {
  _id: string;
  title: string;
  description: string;
  done: boolean;
}

export interface IGetTodos {
  (): AxiosPromise<Array<ITodosResponse>>;
}

export interface IUpdateTodo {
  (params: ITodosResponse): AxiosPromise<string>;
}

export interface IRemoveTodo {
  (id: string): AxiosPromise<string>;
}

export interface IAddTodo {
  (params: Pick<ITodosResponse, 'description' & 'title' & 'done'>): AxiosPromise<string>;
}
