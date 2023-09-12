import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getTodos, markDone, removeTodo } from '../../../store/todos/action-creators';
import { TodoItem } from './todo-item';

import { ITodosResponse } from '../../../api/todos/types';
import { AddTodoForm } from './add-todo-form';

export const Todos = () => {
  const dispatch = useAppDispatch();
  const { todos, isLoading, error } = useAppSelector((s) => s.todos);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const handleDone = (todo: ITodosResponse) => {
    dispatch(markDone(todo));
  };

  const handleRemove = (id: string) => {
    dispatch(removeTodo(id));
  };

  if (isLoading) return <div>loading...</div>;

  if (error) return <div>ERROR</div>;

  if (todos?.length) {
    return (
      <div>
        <AddTodoForm />
        {todos?.map((t) => (
          <TodoItem key={t._id} handleDone={handleDone} handleRemove={handleRemove} todo={t} />
        ))}
      </div>
    );
  }

  return <AddTodoForm />;
};
