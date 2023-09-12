import React from 'react';
import { Grid } from '@alfalab/core-components/grid';
import { Button } from '@alfalab/core-components/button';
import { ITodosResponse } from '../../../../api/todos/types';
import { Typography } from '@alfalab/core-components/typography';
import { Gap } from '@alfalab/core-components/gap';
import styles from './index.module.css';

type Props = {
  handleDone: (todo: ITodosResponse) => void;
  handleRemove: (id: string) => void;
  todo: ITodosResponse;
};

export const TodoItem = ({ todo, handleRemove, handleDone }: Props) => {
  return (
    <Grid.Row align={'middle'} className={styles.item}>
      <Grid.Col align={'middle'} width={9}>
        <Typography.Text className={todo.done ? styles.done : undefined}>
          {todo.title}
        </Typography.Text>
      </Grid.Col>
      <Grid.Col align={'bottom'} width={3}>
        <Button size="s" view="primary" onClick={() => handleDone(todo)}>
          {todo.done ? 'Не выполнено' : 'Выполнено'}
        </Button>
        <Gap size="s" />
        <Button size="s" view="accent" onClick={() => handleRemove(todo._id)}>
          Удалить
        </Button>
      </Grid.Col>
    </Grid.Row>
  );
};
