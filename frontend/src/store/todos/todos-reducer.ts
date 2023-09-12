import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodosResponse } from '../../api/todos/types';

export interface ITodosState {
  todos: Array<{
    _id: string;
    title: string;
    description: string;
    done: boolean;
  }> | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: ITodosState = {
  todos: null,
  isLoading: true,
  error: null,
};

const TodosReducer = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    fetchTodosStart: (state) => ({
      ...state,
      isLoading: true,
    }),
    fetchTodosSuccess: (state, action: PayloadAction<Array<ITodosResponse>>) => ({
      ...state,
      isLoading: false,
      error: null,
      todos: [...action.payload],
    }),
    fetchTodosFailure: (state, action: PayloadAction<string>) => ({
      ...state,
      isLoading: false,
      todos: null,
      error: action.payload,
    }),
    removeTodos: (): ITodosState => initialState,
  },
});

export const { fetchTodosStart, fetchTodosSuccess, fetchTodosFailure, removeTodos } =
  TodosReducer.actions;

export default TodosReducer.reducer;
