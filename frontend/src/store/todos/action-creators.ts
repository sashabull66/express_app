import { Dispatch } from '@reduxjs/toolkit';
import { fetchTodosStart, fetchTodosSuccess, fetchTodosFailure } from './todos-reducer';
import api from '../../api';
import { ITodosResponse } from '../../api/todos/types';

export const getTodos =
  (callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(fetchTodosStart());
      const result = await api.todos.GetTodos();

      dispatch(fetchTodosSuccess(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(fetchTodosFailure((e as Error).message));
    }
  };

export const markDone =
  (todo: ITodosResponse, callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(fetchTodosStart());
      await api.todos.UpdateTodo({ ...todo, done: !todo.done });

      const result = await api.todos.GetTodos();

      dispatch(fetchTodosSuccess(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(fetchTodosFailure((e as Error).message));
    }
  };

export const removeTodo =
  (todoId: string, callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(fetchTodosStart());
      await api.todos.RemoveTodo(todoId);

      const result = await api.todos.GetTodos();

      dispatch(fetchTodosSuccess(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(fetchTodosFailure((e as Error).message));
    }
  };

export const CreateTodo =
  (todo: Pick<ITodosResponse, 'done' & 'title' & 'description'>, callback?: () => void) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(fetchTodosStart());
      await api.todos.AddTodo(todo);

      const result = await api.todos.GetTodos();

      dispatch(fetchTodosSuccess(result.data));

      if (callback) callback();
    } catch (e) {
      dispatch(fetchTodosFailure((e as Error).message));
    }
  };
